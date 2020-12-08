import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { NextControl } from '../nextcontrol.js'
import { Settings } from '../settings.js'
import * as Classes from '../lib/classes.js'

/**
 * Join and leave message plugin
 */
export class Join {

    name           = 'Join and Leave'
    author         = 'dassschaf'
    description    = 'Join and leave message plugin'

    /**
     * Local reference to the main instance
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nextcontrol 
     */
    constructor(nextcontrol) {
        // save reference
        this.nextcontrol = nextcontrol;
    }

    /**
     * Function run, when a player joins the server
     * @param {Classes.PlayerInfo} player Player info
     * @param {Boolean} isSpectator whether player spectates or not
     */
    async onPlayerConnect(player, isSpectator) {                    
        
        await this.nextcontrol.database.collection('players').updateOne({login: player.login}, {$set: player}, {upsert: true});

        if (Settings.admins.includes(player.login)) {
            logger('r','Admin ' + stripFormatting(player.name) + ' has joined the server');
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.adminConnect, { player: player.name })]);
        }

        else {
            logger('r', stripFormatting(player.name) + ' has joined the server');
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.playerConnect, { player: player.name })]);
        }        
    }

    /**
     * Function run, when a player disconnects
     * @param {Classes.PlayerInfo} player Playerinfo of leaving player 
     * @param {String} reason Reason for disconnection
     */
    async onPlayerDisconnect(player, reason) {
        logger('r', stripFormatting(player.name) + ' has left the server, reason: ' + reason);
        await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.playerDisconnect, { player: player.name })]);
    }
}