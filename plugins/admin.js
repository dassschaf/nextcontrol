
import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { Settings } from '../settings.js'

import { ClientWrapper } from '../lib/clientwrapper.js'
import { DatabaseWrapper } from '../lib/dbwrapper.js'
import * as CallbackParams from '../lib/callbackparams.js'
import * as Classes from '../lib/classes.js'
import { NextControl } from '../nextcontrol.js'
import { TMX } from '../lib/tmx.js'

/**
 * Plugin containing the most necessary administration commands and features
 */
export class AdminSuite {

    /**
     * Plugin name
     */
    name           = 'Admin suite'

    /**
     * Plugin author
     */
    author         = 'dassschaf'

    /**
     * Plugin description
     */
    description    = 'Plugin containing the most necessary administration commands and features'

    /**
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nc The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) {
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('rescantrack', this.admin_rescantrack, 'rescans track, to add it to the database', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('restart', this.admin_restart, 'Restarts the current track immediately', this.name));
    }

    /**
     * Rescans the track, to add and update it to the database
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     * @param {NextControl} nc 
     */
    async admin_rescantrack(login, params, nc) {
        let map = nc.status.map;

        map.tmxid = await TMX.getID(map.uid);

        await nc.database.collection('maps').updateOne({uid: map.uid}, {$set: map}, {upsert: true});
    }

    /**
     * Function making the current track being restarted
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     * @param {NextControl} nc 
     */
    async admin_restart(login, params, nc) {
        // get title and player name
        let name = nc.status.getPlayer(login).name;

        nc.client.query('RestartMap').then(res => {
            nc.clientWrapper.chatSendServerMessage(format(Sentences.admin.restart, {name: name}));
        });

    }

}