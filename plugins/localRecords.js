
import { Sentences } from '../lib/sentences.js'
import * as util from '../lib/utilities.js'
import { Settings } from '../settings.js'
let dbtype = Settings.usedDatabase.toLocaleLowerCase();

import * as CallbackParams from '../lib/callbackparams.js'
import * as Classes from '../lib/classes.js'
import { NextControl } from '../nextcontrol.js'
import {Logger} from "../lib/logger.js";

/**
 * Local Records plugin
 */
export class LocalRecords {

    /**
     * Plugin name
     * @type {String}
     */
    name           = 'Local Records'

    /**
     * Plugin author
     * @type {String}
     */
    author         = 'dassschaf'

    /**
     * Plugin description
     * @type {String}
     */
    description    = 'Local Records plugin'

    /**
     * Local reference to the main instance
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nextcontrol The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) {
        nextcontrol.registerChatCommand(new Classes.ChatCommand('recs', this.chat_recs, 'Displays the local records on the current map.', this.name));

        // save reference to the main instance
        this.nextcontrol = nextcontrol;
    }

    /**
     * Chat command, to display local recs on current map
     * @param {String} login Login of the player calling this command
     * @param {Array<String>} params Parameters passed by the player after the command (seperated by space)
     */
    async chat_recs(login, params) {
        let map = this.nextcontrol.status.map;

        // print local records to chat
        if (dbtype === 'mongodb') {
            if ((await this.nextcontrol.mongoDb.collection('records').countDocuments({map : map.uid})) < 1) {
                this.nextcontrol.client.query("ChatSendServerMessageToLogin", [util.format(Sentences.localRecords.noneYet, { when: Sentences.localRecords.rightnow, map: map.name}), login]);

            } else {
                let msg = util.format(Sentences.localRecords.listBegin, {map: map.name, when: Sentences.localRecords.rightnow});

                let records = await this.nextcontrol.mongoDb.collection('records').aggregate([
                    { $match: { map: map.uid } },
                    { $sort: { time: 1 }},
                    { $lookup: {
                        from: 'players',
                        localField: 'login',
                        foreignField: 'login',
                        as: 'player'
                    }}]);

                records = await records.toArray();

                records.forEach((rec, i) => {
                    if (i == records.length - 1)
                        msg += util.format(Sentences.localRecords.listItem, {pos: i+1, name: rec.player[0].name, time: util.msToString(rec.time)});
                    else 
                        msg += util.format(Sentences.localRecords.listItem, {pos: i+1, name: rec.player[0].name, time: util.msToString(rec.time)}) + ', ';
                })

                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [msg, login]);
            }
        } else if (dbtype === 'mysql') {
            // TODO
        }
    }

    /**
     * Function run, when a new match begins
     */
    async onBeginMatch() {

        let map = this.nextcontrol.status.map;

        // print local records to chat
        if (dbtype === 'mongodb') {
            if ((await this.nextcontrol.mongoDb.collection('records').countDocuments({map : map.uid})) < 1) {
                this.nextcontrol.client.query('ChatSendServerMessage', [util.format(Sentences.localRecords.noneYet, { when: Sentences.localRecords.before, map: map.name})]);
            } else {
                let msg = util.format(Sentences.localRecords.listBegin, {map: map.name, when: Sentences.localRecords.before});

                let records = await this.nextcontrol.mongoDb.collection('records').aggregate([
                    { $match: { map: map.uid } },
                    { $sort: { time: 1 }},
                    { $lookup: {
                        from: 'players',
                        localField: 'login',
                        foreignField: 'login',
                        as: 'player'
                    }}]);

                records = await records.toArray();

                //console.log(JSON.stringify(records));

                records.forEach((rec, i) => {
                    if (i == records.length - 1)
                        msg += util.format(Sentences.localRecords.listItem, {pos: i+1, name: rec.player[0].name, time: util.msToString(rec.time)});
                    else 
                        msg += util.format(Sentences.localRecords.listItem, {pos: i+1, name: rec.player[0].name, time: util.msToString(rec.time)}) + ', ';
                })

                await this.nextcontrol.client.query('ChatSendServerMessage', [msg]);
            }
        } else if (dbtype === 'mysql') {
            // TODO
        }
    }

    /**
     * Function run, when a map ends
     * @param {CallbackParams.MatchResults} map Callback parameters
     */
    async onEndMatch(results) {
        let map = this.nextcontrol.status.map;

        // print local records to chat
        if (dbtype === 'mongodb') {
            if ((await this.nextcontrol.mongoDb.collection('records').countDocuments({map : map.uid})) < 1) {
                this.nextcontrol.client.query('ChatSendServerMessage', [util.format(Sentences.localRecords.noneYet, { when: Sentences.localRecords.after, map: map.name})]);
            
            } else {
                let msg = util.format(Sentences.localRecords.listBegin, {map: map.name, when: Sentences.localRecords.after});

                let records = await this.nextcontrol.mongoDb.collection('records').aggregate([
                    { $match: { map: map.uid } },
                    { $sort: { time: 1 }},
                    { $lookup: {
                        from: 'players',
                        localField: 'login',
                        foreignField: 'login',
                        as: 'player'
                    }}]);

                records = await records.toArray();

                records.forEach((rec, i) => {
                    if (i == records.length - 1)
                        msg += util.format(Sentences.localRecords.listItem, {pos: i+1, name: rec.player[0].name, time: util.msToString(rec.time)});
                    else 
                        msg += util.format(Sentences.localRecords.listItem, {pos: i+1, name: rec.player[0].name, time: util.msToString(rec.time)}) + ', ';
                })

                await this.nextcontrol.client.query('ChatSendServerMessage', [msg]);
            }
        } else if (dbtype === 'mysql') {
            // TODO
        }
    } 

    /**
     * Function run, whenever a player passes a waypoint (finish, multilap, checkpoint, ...)
     * @param {Classes.WaypointInfo} waypointInfo
     */
    async onWaypoint(waypointInfo) {

        if (waypointInfo.isEndRace == true) this.onFinish(waypointInfo.login, waypointInfo.raceTime);

    }

    /**
     * Function run, when a player passes the finish line and finishes their run
     * @param {String} login
     * @param {Number} timeOrScore
     */
    async onFinish(login, timeOrScore) {

        let uid = this.nextcontrol.status.map.uid;

        let timeString = util.msToString(timeOrScore);

        if (dbtype === 'mongodb') {
            // get current local record and determine whether improvement
            if ((await this.nextcontrol.mongoDb.collection('records').countDocuments({ map: uid, login: login })) == 0) {
                // no record exists yet
                // insert new record document
                let rec = new Classes.LocalRecord(login, timeOrScore, uid);

                await this.nextcontrol.mongoDb.collection('records').insertOne(rec);

                let pos = util.nth((await this.nextcontrol.mongoDb.collection('records').countDocuments({map: uid, time: {$lt: rec.time}})) + 1),
                    name = this.nextcontrol.status.getPlayer(login).name;

                let msg = util.format(Sentences.localRecords.claimed, {player: name, pos: pos, time: timeString});

                await this.nextcontrol.client.query('ChatSendServerMessage', [msg]);

                Logger.info(`${util.stripFormatting(name)} claimed ${pos} local record (${timeString}) on ${util.stripFormatting(this.nextcontrol.status.map.name)}`);
                
            } else {
                let rec = new Classes.LocalRecord(login, timeOrScore, uid);

                // there is already an existing, matching record:
                let currentRecord = await this.nextcontrol.mongoDb.collection('records').findOne({ map: uid, login: login });

                // if improvement, update record and determine position
                if (currentRecord.time > timeOrScore) { 
                    // improvement!

                    // save new new time to database
                    await this.nextcontrol.mongoDb.collection('records').updateOne({login: login, map: uid}, {$set: rec});

                    // send improvement message:
                    let improvement = - (currentRecord.time - rec.time) / 1000,
                        pos = util.nth((await this.nextcontrol.mongoDb.collection('records').countDocuments({map: uid, time: {$lt: rec.time}})) + 1),
                        name = this.nextcontrol.status.getPlayer(login).name;

                    let msg = util.format(Sentences.localRecords.improved, {player: name, pos: pos, time: timeString, imp: improvement});

                    await this.nextcontrol.client.query('ChatSendServerMessage', [msg]);
                    Logger.info(`${util.stripFormatting(name)} improved to ${pos} local record (${timeString}) on ${util.stripFormatting(this.nextcontrol.status.map.name)}`);

                } else if (currentRecord.time == timeOrScore) {
                    let pos = util.nth((await this.nextcontrol.mongoDb.collection('records').countDocuments({map: uid, time: {$lt: rec.time}})) + 1),
                        name = this.nextcontrol.status.getPlayer(login).name;

                    let msg = util.format(Sentences.localRecords.equalled, {player: name, pos: pos, time: timeString});

                    await this.nextcontrol.client.query('ChatSendServerMessage', [msg]);
                    Logger.info(`${util.stripFormatting(name)} equalled their ${pos} local record (${timeString}) on ${util.stripFormatting(this.nextcontrol.status.map.name)}`);

                } // else: currentRecord.time < timeOrScore, no improvement, ignore this
            } // else, ignore.
        } else if (dbtype === 'mysql') {
            // TODO
        }
    }

}