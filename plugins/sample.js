
import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { Settings } from '../settings.js'

import { ClientWrapper } from '../lib/clientwrapper.js'
import { DatabaseWrapper } from '../lib/dbwrapper.js'
import * as CallbackParams from '../lib/callbackparams.js'
import * as Classes from '../lib/classes.js'
import { NextControl } from '../nextcontrol.js'

/**
 * Heavily documented sample plugin, allowing you to jump immediately into plugin development
 */
export class SamplePlugin {

    /**
     * Plugin name
     */
    name           = 'Sample Plugin'

    /**
     * Plugin author
     */
    author         = 'dassschaf'

    /**
     * Plugin description
     */
    description    = 'Heavily documented sample plugin, allowing you to jump immediately into plugin development'

    /**
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nextcontrol The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) {
        
        // register chat commands here:
        nextcontrol.registerChatCommand(new Classes.ChatCommand(
            // command name -- no spaces allowed, name admin forbidden!
            'HelloWorld',

            // command handler:
            this.commandHelloWorld,
            
            // command description:
            'A simple Hello World command, demonstrating command implementation',

            // this plugin's name:
            this.name
        ));

    }

    /**
     * Hello World chat command!
     * @param {Classes.ChatCommandParameters} params parameters
     * @param {NextControl} nextcontrol main class instance
     */
    commandHelloWorld(params, nextcontrol) {
        nextcontrol.clientWrapper.chatSendServerMessageToLogin('$f00Hello World!', params.login);
        logger('r', 'Sent hello world to ' + params.login);
    }

    /**
     * Function run, when a player joins the server
     * @param {CallbackParams.PlayerConnect} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onPlayerConnect(params, nextcontrol) {

    }

    /**
     * Function run, when a player sends a chat message or command
     * DO NOT use this for handling commands, those are supposed to be registered at the main class
     * @param {CallbackParams.ChatMessage} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onChat(params, nextcontrol) {

    }

    /**
     * Function run, when a player disconnects the server
     * @param {CallbackParams.PlayerDisconnect} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onPlayerDisconnect(params, nextcontrol) {

    }

    /**
     * Function run, when a new map begins
     * @param {Classes.Map} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onBeginMap(params, nextcontrol) {

    }

    /**
     * Function run, when a new match begins
     * @param {NextControl} nextcontrol main class instance
     */
    onBeginMatch(nextcontrol) {

    }

    /**
     * Function run, when a started transaction's bill is updated
     * @param {CallbackParams.UpdatedBill} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onBillUpdate(params, nextcontrol) {

    }

    /**
     * Function run, when a map ends
     * @param {Classes.Map} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onEndMap(params, nextcontrol) {

    }

    /**
     * Function run, when a match ends
     * @param {CallbackParams.MatchResults} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onEndMatch(params, nextcontrol) {

    }

    /**
     * Function run, when the maplist changes
     * @param {CallbackParams.MaplistChange} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onMaplistChange(params, nextcontrol) {

    }

    /**
     * Function run, when a gamemode script triggers a callback
     * @param {CallbackParams.ModeScriptCallback} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onModeScriptCallback(params, nextcontrol) {

    }

    /**
     * Function run, when a player switches teams (??)
     * @param {string} login Player's login
     * @param {NextControl} nextcontrol main class instance
     */
    onPlayersAlliesChange(login, nextcontrol) {

    }

    /**
     * Function run, when a player's info changes
     * @param {Classes.PlayerInfo} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onPlayerInfoChange(params, nextcontrol) {

    }

    /**
     * Function run, when a player interacts with a displayed manialink
     * @param {CallbackParams.ManialinkPageAnswer} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    onManialinkPageAnswer(params, nextcontrol) {

    }

    /**
     * Function run, when the server transitions from one state to another
     * @param {Classes.ServerStatus} params Server Status object
     * @param {NextControl} nextcontrol main class instance
     */
    onStatusChange(params, nextcontrol) {
        
    }

    /**
     * Function run, when the server recieves data from a player, transmitted as base64 encoded
     * @param {CallbackParams.TunnelData} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    onTunnelDataRecieved(params, nextcontrol) {

    }

    /**
     * Function run, when a callvote is updated
     * @param {Classes.CallVote} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    onVoteUpdate(params, nextcontrol) {

    }    

    /**
     * Function run, when a player passes a checkpoint (be careful, this one might happen very often!)
     * @param {CallbackParams.PlayerCheckpoint} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    onCheckpoint(params, nextcontrol) {

    }

    /**
     * Function run, when a player passes the finish line and finishes their run
     * @param {CallbackParams.PlayerFinish} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    onFinish(params, nextcontrol) {

    }

    /**
     * Function run, when a player's run in invalidated
     * @param {CallbackParams.PlayerIncoherence} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    onIncoherence(params, nextcontrol) {

    }

}