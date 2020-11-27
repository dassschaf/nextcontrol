
import { Sentences } from '../lib/sentences.js'
import * as util from '../lib/utilities.js'
import { Settings } from '../settings.js'

import { ClientWrapper } from '../lib/clientwrapper.js'
import { DatabaseWrapper } from '../lib/dbwrapper.js'
import * as CallbackParams from '../lib/callbackparams.js'
import * as Classes from '../lib/classes.js'
import { NextControl } from '../nextcontrol.js'

/**
 * Local Records plugin
 */
export class LocalRecords {

    /**
     * Plugin name
     */
    name           = 'Local Records'

    /**
     * Plugin author
     */
    author         = 'dassschaf'

    /**
     * Plugin description
     */
    description    = 'Local Records plugin'

    /**
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nextcontrol The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) {
        nextcontrol.registerChatCommand(new Classes.ChatCommand('recs', this.chat_recs, 'Displays the local records on the current track.', this.name));
    }

    /**
     * Chat command, to display local recs on current track
     * @param {String} login Login of the player calling this command
     * @param {Array<String>} params Parameters passed by the player after the command (seperated by space)
     * @param {NextControl} nextcontrol main class instance
     */
    async chat_recs(login, params, nextcontrol) {
        let map = nextcontrol.status.map;

        // print local records to chat
        if ((await nextcontrol.database.collection('records').countDocuments({track : map.uid})) < 1) {
            nextcontrol.client.query("ChatSendServerMessageToLogin", [util.format(Sentences.localRecords.noneYet, { when: Sentences.localRecords.rightnow, track: map.name}), login]);

        } else {
            let msg = util.format(Sentences.localRecords.listBegin, {track: map.name, when: Sentences.localRecords.rightnow});

            let records = await nextcontrol.database.collection('records').aggregate([
                { $match: { track: map.uid } },
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

            await nextcontrol.client.query('ChatSendServerMessageToLogin', [msg, login]);
        }
    }

    /**
     * Function run, when a new match begins
     * @param {NextControl} nextcontrol main class instance
     */
    async onBeginMatch(nextcontrol) {

        let map = nextcontrol.status.map;

        // print local records to chat
        if ((await nextcontrol.database.collection('records').countDocuments({track : map.uid})) < 1) {
            nextcontrol.clientWrapper.chatSendServerMessage(util.format(Sentences.localRecords.noneYet, { when: Sentences.localRecords.before, track: map.name}));
        } else {
            let msg = util.format(Sentences.localRecords.listBegin, {track: map.name, when: Sentences.localRecords.before});

            let records = await nextcontrol.database.collection('records').aggregate([
                { $match: { track: map.uid } },
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

            await nextcontrol.client.query('ChatSendServerMessage', [msg]);
        }


    }

    /**
     * Function run, when a map ends
     * @param {CallbackParams.MatchResults} map Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onEndMatch(results, nextcontrol) {
        let map = nextcontrol.status.map;

        // print local records to chat
        if ((await nextcontrol.database.collection('records').countDocuments({track : map.uid})) < 1) {
            nextcontrol.clientWrapper.chatSendServerMessage(util.format(Sentences.localRecords.noneYet, { when: Sentences.localRecords.after, track: map.name}));
        
        } else {
            let msg = util.format(Sentences.localRecords.listBegin, {track: map.name, when: Sentences.localRecords.after});

            let records = await nextcontrol.database.collection('records').aggregate([
                { $match: { track: map.uid } },
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

            await nextcontrol.client.query('ChatSendServerMessage', [msg]);
        }
    } 

    /**
     * Function run, whenever a player passes a waypoint (finish, multilap, checkpoint, ...)
     * @param {Classes.WaypointInfo} waypointInfo
     * @param {NextControl} nextcontrol 
     */
    async onWaypoint(waypointInfo, nextcontrol) {

        if (waypointInfo.isEndRace == true) this.onFinish(waypointInfo.login, waypointInfo.raceTime, nextcontrol);

    }

    /**
     * Function run, when a player passes the finish line and finishes their run
     * @param {String} login
     * @param {Number} timeOrScore
     * @param {NextControl} nextcontrol main class instance
     */
    async onFinish(login, timeOrScore, nextcontrol) {

        let uid = nextcontrol.status.map.uid;

        let timeString = util.msToString(timeOrScore);

        // get current local record and determine whether improvement
        if ((await nextcontrol.database.collection('records').countDocuments({ track: uid, login: login })) == 0) {
            // no record exists yet
            // insert new record document
            let rec = new Classes.LocalRecord(login, timeOrScore, uid);

            await nextcontrol.database.collection('records').insertOne(rec);

            let pos = util.nth((await nextcontrol.database.collection('records').countDocuments({track: uid, time: {$lt: rec.time}})) + 1),
                name = nextcontrol.status.getPlayer(login).name;

            let msg = util.format(Sentences.localRecords.claimed, {player: name, pos: pos, time: timeString});

            await nextcontrol.client.query('ChatSendServerMessage', [msg]);

            util.logger('r', `${util.stripFormatting(name)} claimed ${pos} local record (${timeString}) on ${util.stripFormatting(nextcontrol.status.map.name)}`);
            
        } else {
            let rec = new Classes.LocalRecord(login, timeOrScore, uid);

            // there is already an existing, matching record:
            let currentRecord = await nextcontrol.database.collection('records').findOne({ track: uid, login: login });

            // if improvement, update record and determine position
            if (currentRecord.time > timeOrScore) { 
                // improvement!

                // save new new time to database
                await nextcontrol.database.collection('records').updateOne({login: login, track: uid}, {$set: rec});

                // send improvement message:
                let improvement = - (currentRecord.time - rec.time) / 1000,
                    pos = util.nth((await nextcontrol.database.collection('records').countDocuments({track: uid, time: {$lt: rec.time}})) + 1),
                    name = nextcontrol.status.getPlayer(login).name;

                let msg = util.format(Sentences.localRecords.improved, {player: name, pos: pos, time: timeString, imp: improvement});

                await nextcontrol.client.query('ChatSendServerMessage', [msg]);
                util.logger('r', `${util.stripFormatting(name)} improved to ${pos} local record (${timeString}) on ${util.stripFormatting(nextcontrol.status.map.name)}`);

            } else if (currentRecord.time == timeOrScore) {
                let pos = util.nth((await nextcontrol.database.collection('records').countDocuments({track: uid, time: {$lt: rec.time}})) + 1),
                    name = nextcontrol.status.getPlayer(login).name;

                let msg = util.format(Sentences.localRecords.equalled, {player: name, pos: pos, time: timeString});

                await nextcontrol.client.query('ChatSendServerMessage', [msg]);
                util.logger('r', `${util.stripFormatting(name)} equalled their ${pos} local record (${timeString}) on ${util.stripFormatting(nextcontrol.status.map.name)}`);

            } // else: currentRecord.time < timeOrScore, no improvement, ignore this
        }
        // else, ignore.
    }

}