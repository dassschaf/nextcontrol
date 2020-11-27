
import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { Settings } from '../settings.js'

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
            'helloWorld',

            // command handler:
            this.commandHelloWorld,
            
            // command description:
            'A simple Hello World command, demonstrating command implementation',

            // this plugin's name:
            this.name
        ));

        // register admin commands like this:
        nextcontrol.registerAdminCommand(new Classes.ChatCommand(
            // name:
            'helloWorld',

            // handler:
            this.commandAdminHelloWorld,

            // description:
            'Hello world, but for admins.',

            this.name
        ));

    }

    /**
     * Hello World chat command!
     * @param {String} login Login of the player calling this command
     * @param {Array<String>} params Parameters passed by the player after the command (seperated by space)
     * @param {NextControl} nextcontrol main class instance
     */
    async commandHelloWorld(login, params, nextcontrol) {
        nextcontrol.clientWrapper.chatSendServerMessageToLogin('$f00Hello World!', login);
    }

    /**
     * Hello World chat command for admins!
     * @param {String} login Login of the player calling this command
     * @param {Array<String>} params Parameters passed by the player after the command (seperated by space)
     * @param {NextControl} nextcontrol main class instance
     */
    async commandAdminHelloWorld(login, params, nextcontrol) {
        nextcontrol.clientWrapper.chatSendServerMessageToLogin('$f0fHello World!', login);
    }

    /**
     * Function run, whenever a player passes a waypoint (finish, multilap, checkpoint, ...)
     * @param {Classes.WaypointInfo} waypointInfo
     * @param {NextControl} nextcontrol 
     */
    async onWaypoint(waypointInfo, nextcontrol) {

    }

    /**
     * Function run, when a player joins the server
     * @param {Classes.PlayerInfo} player Player info
     * @param {Boolean} isSpectator whether player spectates or not
     * @param {NextControl} nextcontrol main class instance
     */
    async onPlayerConnect(player, isSpectator, nextcontrol) { 

    }

    /**
     * Function run, when a player sends a chat message or command
     * DO NOT use this for handling commands, those are supposed to be registered at the main class
     * @param {String} login Player's login
     * @param {String} text Message text
     * @param {NextControl} nextcontrol main class instance
     */
    async onChat(login, text, nextcontrol) {

    }

    /**
     * Function run, when a player disconnects
     * @param {Classes.PlayerInfo} player Playerinfo of leaving player 
     * @param {String} reason Reason for disconnection
     * @param {NextControl} nextcontrol main object
     */
    async onPlayerDisconnect(player, reason, nextcontrol) {

    }

    /**
     * Function run, when a new map begins
     * @param {Classes.Map} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onBeginMap(params, nextcontrol) {

    }

    /**
     * Function run, when a new match begins
     * @param {NextControl} nextcontrol main class instance
     */
    async onBeginMatch(nextcontrol) {

    }

    /**
     * Function run, when a started transaction's bill is updated
     * @param {CallbackParams.UpdatedBill} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onBillUpdate(params, nextcontrol) {

    }

    /**
     * Function run, when a map ends
     * @param {Classes.Map} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onEndMap(params, nextcontrol) {

    }

    /**
     * Function run, when a match ends
     * @param {CallbackParams.MatchResults} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onEndMatch(params, nextcontrol) {

    }

    /**
     * Function run, when the maplist changes
     * @param {CallbackParams.MaplistChange} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onMaplistChange(params, nextcontrol) {

    }

    /**
     * Function run, when a gamemode script triggers a callback
     * @param {CallbackParams.ModeScriptCallback} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onModeScriptCallback(params, nextcontrol) {

    }

    /**
     * Function run, when a player switches teams (??)
     * @param {string} login Player's login
     * @param {NextControl} nextcontrol main class instance
     */
    async onPlayersAlliesChange(login, nextcontrol) {

    }

    /**
     * Function run, when a player's info changes
     * @param {Classes.PlayerInfo} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onPlayerInfoChange(params, nextcontrol) {

    }

    /**
     * Function run, when a player interacts with a displayed manialink
     * @param {CallbackParams.ManialinkPageAnswer} params Callback parameters
     * @param {NextControl} nextcontrol main class instance
     */
    async onManialinkPageAnswer(params, nextcontrol) {

    }

    /**
     * Function run, when the server transitions from one state to another
     * @param {Classes.ServerStatus} params Server Status object
     * @param {NextControl} nextcontrol main class instance
     */
    async onStatusChange(params, nextcontrol) {
        
    }

    /**
     * Function run, when the server recieves data from a player, transmitted as base64 encoded
     * @param {CallbackParams.TunnelData} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    async onTunnelDataRecieved(params, nextcontrol) {

    }

    /**
     * Function run, when a callvote is updated
     * @param {Classes.CallVote} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    async onVoteUpdate(params, nextcontrol) {

    }    

    /**
     * Function run, when a player passes a checkpoint (be careful, this one might happen very often!)
     * @param {CallbackParams.PlayerCheckpoint} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    async onCheckpoint(params, nextcontrol) {

    }

    /**
     * Function run, when a player's run in invalidated
     * @param {CallbackParams.PlayerIncoherence} params Callback params
     * @param {NextControl} nextcontrol main class instance
     */
    async onIncoherence(params, nextcontrol) {

    }

}