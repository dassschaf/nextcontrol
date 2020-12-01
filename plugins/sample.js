
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
     * Local reference to the main instance
     * @type {NextControl}
     */
    nextcontrol

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

        // save the reference to the main class instance
        this.nextcontrol = nextcontrol;
    }

    /**
     * Hello World chat command!
     * @param {String} login Login of the player calling this command
     * @param {Array<String>} params Parameters passed by the player after the command (seperated by space)
     */
    async commandHelloWorld(login, params) {
        
        // For allowed queries, look up the XML-RPC methods for the
        // TM2/020 dedicated server: https://doc.maniaplanet.com/dedicated-server/references/xml-rpc-methods

        this.nextcontrol.client.query('ChatSendServerMessageToLogin', ['$f00Hello World!', login]);
    }

    /**
     * Hello World chat command for admins!
     * @param {String} login Login of the player calling this command
     * @param {Array<String>} params Parameters passed by the player after the command (seperated by space)
     */
    async commandAdminHelloWorld(login, params) {

        // to access the main class instance, refer to this.nextcontrol, as the reference is stored there
        // if another plugin does something or information in that object is updated, it's visible here too
        // as we saved the reference we got passed in the constructor.

        this.nextcontrol.client.query('ChatSendServerMessageToLogin', ['$f0fHello World!', login]);
    }

    /**
     * Function run, whenever a player passes a waypoint (finish, multilap, checkpoint, ...)
     * @param {Classes.WaypointInfo} waypointInfo
     */
    async onWaypoint(waypointInfo) {

    }

    /**
     * Function run, when a player joins the server
     * @param {Classes.PlayerInfo} player Player info
     * @param {Boolean} isSpectator whether player spectates or not
     */
    async onPlayerConnect(player, isSpectator) { 

    }

    /**
     * Function run, when a player sends a chat message or command
     * DO NOT use this for handling commands, those are supposed to be registered at the main class
     * @param {String} login Player's login
     * @param {String} text Message text
     */
    async onChat(login, text) {

    }

    /**
     * Function run, when a player disconnects
     * @param {Classes.PlayerInfo} player Playerinfo of leaving player 
     * @param {String} reason Reason for disconnection
     */
    async onPlayerDisconnect(player, reason) {

    }

    /**
     * Function run, when a new map begins
     * @param {Classes.Map} params Callback parameters
     */
    async onBeginMap(params) {

    }

    /**
     * Function run, when a new match begins
     */
    async onBeginMatch() {

    }

    /**
     * Function run, when a started transaction's bill is updated
     * @param {CallbackParams.UpdatedBill} params Callback parameters
     */
    async onBillUpdate(params) {

    }

    /**
     * Function run, when a map ends
     * @param {Classes.Map} params Callback parameters
     */
    async onEndMap(params) {

    }

    /**
     * Function run, when a match ends
     * @param {CallbackParams.MatchResults} params Callback parameters
     */
    async onEndMatch(params) {

    }

    /**
     * Function run, when the maplist changes
     * @param {CallbackParams.MaplistChange} params Callback parameters
     */
    async onMaplistChange(params) {

    }

    /**
     * Function run, when a gamemode script triggers a callback
     * @param {CallbackParams.ModeScriptCallback} params Callback parameters
     */
    async onModeScriptCallback(params,) {

    }

    /**
     * Function run, when a player switches teams (??)
     * @param {string} login Player's login
     */
    async onPlayersAlliesChange(login) {

    }

    /**
     * Function run, when a player's info changes
     * @param {Classes.PlayerInfo} params Callback parameters
     */
    async onPlayerInfoChange(params) {

    }

    /**
     * Function run, when a player interacts with a displayed manialink
     * @param {CallbackParams.ManialinkPageAnswer} params Callback parameters
     */
    async onManialinkPageAnswer(params) {

    }

    /**
     * Function run, when the server transitions from one state to another
     * @param {Classes.ServerStatus} params Server Status object
     */
    async onStatusChange(params) {
        
    }

    /**
     * Function run, when the server recieves data from a player, transmitted as base64 encoded
     * @param {CallbackParams.TunnelData} params Callback params
     */
    async onTunnelDataRecieved(params) {

    }

    /**
     * Function run, when a callvote is updated
     * @param {Classes.CallVote} params Callback params
     */
    async onVoteUpdate(params) {

    }    

    /**
     * Function run, when a player passes a checkpoint (be careful, this one might happen very often!)
     * @param {CallbackParams.PlayerCheckpoint} params Callback params
     */
    async onCheckpoint(params) {

    }

    /**
     * Function run, when a player's run in invalidated
     * @param {CallbackParams.PlayerIncoherence} params Callback params
     */
    async onIncoherence(params) {

    }

}