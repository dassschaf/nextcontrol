import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { NextControl } from '../nextcontrol.js'
import { Settings } from '../settings.js'
import * as CallbackParams from '../lib/callbackparams.js'
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
     * @param {CallbackParams.PlayerConnect} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onPlayerConnect(params, nextcontrol) {
        
        let serverPlayerInfo = await nextcontrol.databaseWrapper.getPlayerInfo(params.login),
            playerInfo = await nextcontrol.databaseWrapper.getPlayerInfo(params.login);

        if (playerInfo == null || serverPlayerInfo.login != playerInfo.login)
            playerInfo = serverPlayerInfo;           
        
        nextcontrol.databaseWrapper.updatePlayerInfo(playerInfo);

        logger('r', stripFormatting(playerInfo.name) + ' has joined the server');
        nextcontrol.clientWrapper.chatSendServerMessage(format(Sentences.playerConnect, [playerInfo.name]));
    }

    /**
     * Function run, when a player disconnects the server
     * @param {CallbackParams.PlayerDisconnect} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onPlayerDisconnect(params, nextcontrol) {
        let playerInfo = await nextcontrol.databaseWrapper.getPlayerInfo(params.login);

        if (playerInfo.login == undefined) // if player is for some reason unknown to database:
            playerInfo = {name: 'unknown', login: 'unknown'};

        logger('r', stripFormatting(playerInfo.name) + ' has left the server');
        nextcontrol.clientWrapper.chatSendServerMessage(format(Sentences.playerDisconnect, [playerInfo.name]));
    }
}