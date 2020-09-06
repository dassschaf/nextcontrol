import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { Settings } from '../settings.js'

// various wrapper classes:
import { ClientWrapper } from '../lib/clientwrapper.js'
import { DatabaseWrapper } from '../lib/dbwrapper.js'
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
     * Constructor, putting the wrapper objects into the plugin class
     * @param {Classes.WrapperList} conns wrapper object list
     */
    constructor(conns) {
        // set up connections:
        this.client = conns.client;
        this.database = conns.database;
    }

    /**
     * Function run, when a player joins the server
     * @param {CallbackParams.PlayerConnect} params Callback parameters
     */
    async onPlayerConnect(params) {
        
        let serverPlayerInfo = await this.client.getPlayerInfo(params.login),
            playerInfo = await this.database.getPlayerInfo(params.login);

        if (serverPlayerInfo.login != playerInfo.login)
            playerInfo = serverPlayerInfo;           
        
        this.database.updatePlayerInfo(playerInfo);

        logger('r', stripFormatting(playerInfo.name) + ' has joined the server');
        this.client.chatSendServerMessage(format(Sentences.playerConnect, [playerInfo.name]));
    }

    /**
     * Function run, when a player disconnects the server
     * @param {CallbackParams.PlayerDisconnect} params Callback parameters
     */
    async onPlayerDisconnect(params) {
        let playerInfo = await this.database.getPlayerInfo(params.login);

        if (playerInfo.login == undefined) // if player is for some reason unknown to database:
            playerInfo = {name: 'unknown', login: 'unknown'};

        logger('r', stripFormatting(playerInfo.name) + ' has left the server');
        this.client.chatSendServerMessage(format(Sentences.playerDisconnect, [playerInfo.name]));
    }
}