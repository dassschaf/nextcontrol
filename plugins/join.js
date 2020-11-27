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
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nextcontrol The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) { }

    /**
     * Function run, when a player joins the server
     * @param {Classes.PlayerInfo} player Player info
     * @param {Boolean} isSpectator whether player spectates or not
     * @param {NextControl} nextcontrol main class instance
     */
    async onPlayerConnect(player, isSpectator, nextcontrol) {                    
        
        nextcontrol.databaseWrapper.updatePlayerInfo(player);

        if (Settings.admins.includes(player.login)) {
            logger('r','Admin ' + stripFormatting(player.name) + ' has joined the server');
            nextcontrol.clientWrapper.chatSendServerMessage(format(Sentences.adminConnect, { player: player.name }));
        }

        else {
            logger('r', stripFormatting(player.name) + ' has joined the server');
            nextcontrol.clientWrapper.chatSendServerMessage(format(Sentences.playerConnect, { player: player.name }));
        }        
    }

    /**
     * Function run, when a player disconnects
     * @param {Classes.PlayerInfo} player Playerinfo of leaving player 
     * @param {String} reason Reason for disconnection
     * @param {NextControl} nextcontrol main object
     */
    async onPlayerDisconnect(player, reason, nextcontrol) {
        logger('r', stripFormatting(player.name) + ' has left the server, reason: ' + reason);
        nextcontrol.clientWrapper.chatSendServerMessage(format(Sentences.playerDisconnect, { player: player.name }));
    }
}