
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
     * @param {Classes.Map} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onBeginMap(params, nextcontrol) {

        // read track info into variable
        let map = nextcontrol.clientWrapper.getCurrentMapInfo()
        this.currentTrack.uid = map.uid;

        // add track to database, if it hasn't been added yet
        if (await nextcontrol.database.collection('maps').countDocuments({ uid: map.uid }) < 1) {
            await nextcontrol.database.collection('maps').insertOne(map);
        }

        // print local records to chat
        if (await nextcontrol.database.collection('records').countDocuments() < 1) {
            nextcontrol.clientWrapper.chatSendServerMessage(format(Sentences.localRecords.noneYet, { when: Sentences.localRecords.before }));
        } else {
            // do smth
        }


    }

    /**
     * Function run, when a map ends
     * @param {Classes.Map} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onEndMap(params, nextcontrol) {

        // print local records to chat

    } 

    /**
     * Function run, when a player passes the finish line and finishes their run
     * @param {CallbackParams.PlayerFinish} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    onFinish(params, nextcontrol) {

        if (params.timeOrScore == 0) return; // bail out, if there's no finish time

        let uid = this.currentTrack.uid,
            login = params.login;

        // get current local record and determine whether improvement
        if (await nextcontrol.database.collection('records').countDocuments({ uid: uid, login: login }) < 1) {
            // no record exists yet
            
            
            
        } else {
            // there is already an existing, matching record:
            let currentRecord = await nextcontrol.database.collection('records').findOne({ uid: uid, login: login });

            // if improvement, update record and determine position
            if (currentRecord.time > params.timeOrScore) { 
                // improvement! 

            } else if (currentRecord.time == params.timeOrScore) {
                // equal!

            } // else: currentRecord.time < params.timeOrScore, no improvement, ignore this
        }
        // else, ignore.
    }

}