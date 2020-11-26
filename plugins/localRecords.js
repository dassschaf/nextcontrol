
import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
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

    currentTrack = {
        /**
         * current track UID
         */
        uid: ''
    }


    /**
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nextcontrol The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) {
        

        
    }

    /**
     * Function run, when a new map begins
     * @param {Classes.Map} map Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onBeginMap(map, nextcontrol) {

        // print local records to chat
        if (await nextcontrol.database.collection('records').countDocuments({uid : map.uid}) < 1) {
            nextcontrol.clientWrapper.chatSendServerMessage(format(Sentences.localRecords.noneYet, { when: Sentences.localRecords.before, track: map.name}));
        } else {
            let records = await nextcontrol.database.collection('records').find({uid : map.uid}).sort({time: 1});

            // print:
            let msg = format(Sentences.localRecords.listBegin, {track: map.name, when: Sentences.localRecords.before});
            
            records.forEach(async (rec, i) => {
                if (i < records.length - 1) {
                    let nickname = (await nextcontrol.database.collection('players').findOne({login: rec.login})).name;
                    msg += format(Sentences.localRecords.listItem, {pos: i + 1, name: nickname, time: rec.time}) + ', ';
                }
                else {
                    let nickname = (await nextcontrol.database.collection('players').findOne({login: rec.login})).name;
                    msg += format(Sentences.localRecords.listItem, {pos: i + 1, name: nickname, time: rec.time});
                }
            });

            nextcontrol.client.query('ChatSendServerMessage', [msg]);
        }


    }

    /**
     * Function run, when a map ends
     * @param {Classes.Map} map Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onEndMap(map, nextcontrol) {

        // print local records to chat
        if (await nextcontrol.database.collection('records').countDocuments({uid : map.uid}) < 1) {
            nextcontrol.clientWrapper.chatSendServerMessage(format(Sentences.localRecords.noneYet, { when: Sentences.localRecords.after, track: map.name}));
        } else {
            let records = await nextcontrol.database.collection('records').find({uid : map.uid}).sort({time: 1});

            // print:
            let msg = format(Sentences.localRecords.listBegin, {track: map.name, when: Sentences.localRecords.after});
            
            records.forEach(async (rec, i) => {
                if (i < records.length - 1) {
                    let nickname = (await nextcontrol.database.collection('players').findOne({login: rec.login})).name;
                    msg += format(Sentences.localRecords.listItem, {pos: i + 1, name: nickname, time: rec.time}) + ', ';
                }
                else {
                    let nickname = (await nextcontrol.database.collection('players').findOne({login: rec.login})).name;
                    msg += format(Sentences.localRecords.listItem, {pos: i + 1, name: nickname, time: rec.time});
                }
            });

            nextcontrol.client.query('ChatSendServerMessage', [msg]);
        }
    } 

    /**
     * Function run, when a player passes the finish line and finishes their run
     * @param {CallbackParams.PlayerFinish} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    async onFinish(params, nextcontrol) {

        if (params.timeOrScore == 0) return; // bail out, if there's no finish time

        let uid = nextcontrol.status.map.uid,
            login = params.login;

        // get current local record and determine whether improvement
        if (await nextcontrol.database.collection('records').countDocuments({ uid: uid, login: login }) < 1) {
            // no record exists yet
            // insert new record document
            let rec = new Classes.LocalRecord(login, params.timeOrScore, uid);

            await nextcontrol.database.collection('records').insertOne(rec);

            let pos = await nextcontrol.database.collection('records').countDocuments({uid: uid, time: {$lt: rec.time}}),
                name = nextcontrol.status.getPlayer(login).name;

            let msg = format(Sentences.localRecords.claimed, {player: name, pos: pos, time: rec.time});

            await nextcontrol.client.query('ChatSendServerMessage', [msg]);

            logger('r', `${stripFormatting(name)} claimed ${pos}. local record (${rec.time}) on ${stripFormatting(nextcontrol.status.map.name)}`);
            
        } else {
            // there is already an existing, matching record:
            let currentRecord = await nextcontrol.database.collection('records').findOne({ uid: uid, login: login });

            // if improvement, update record and determine position
            if (currentRecord.time > params.timeOrScore) { 
                // improvement!

                // save new new time to database
                await nextcontrol.database.collection('records').updateOne({login: login, uid: uid}, {$set: rec});

                // send improvement message:
                let improvement = (currentRecord.time - rec.time) / 1000,
                    pos = await nextcontrol.database.collection('records').countDocuments({uid: uid, time: {$lt: rec.time}}),
                    name = nextcontrol.status.getPlayer(login).name;

                let msg = format(Sentences.localRecords.improved, {player: name, pos: pos, time: rec.time, imp: improvement});

                await nextcontrol.client.query('ChatSendServerMessage', [msg]);
                logger('r', `${stripFormatting(name)} improved to ${pos}. local record (${rec.time}) on ${stripFormatting(nextcontrol.status.map.name)}`);

            } else if (currentRecord.time == params.timeOrScore) {
                let pos = await nextcontrol.database.collection('records').countDocuments({uid: uid, time: {$lt: rec.time}}),
                    name = nextcontrol.status.getPlayer(login).name;

                let msg = format(Sentences.localRecords.equalled, {player: name, pos: pos, time: rec.time});

                await nextcontrol.client.query('ChatSendServerMessage', [msg]);
                logger('r', `${stripFormatting(name)} equalled their ${pos}. local record (${rec.time}) on ${stripFormatting(nextcontrol.status.map.name)}`);

            } // else: currentRecord.time < params.timeOrScore, no improvement, ignore this
        }
        // else, ignore.
    }

}