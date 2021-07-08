
import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { Settings } from '../settings.js'

import * as CallbackParams from '../lib/callbackparams.js'
import * as Classes from '../lib/classes.js'
import { NextControl } from '../nextcontrol.js'

export class HelpCommand {
    name           = 'Help'
    author         = 'Greep'
    description    = 'List all commands and loaded plugins'

    /**
     * Local reference to the main class instance
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Help command handler
     * @param {NextControl} nextcontrol The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) {
        
        // register chat commands here:
        nextcontrol.registerChatCommand(new Classes.ChatCommand(
            // command name -- no spaces allowed, name admin forbidden!
            'help',

            // command handler:
            this.commandHelp,
            
            // command description:
            'This help',

            // this plugin's name:
            this.name
        ));

        nextcontrol.registerChatCommand(new Classes.ChatCommand(
            // command name -- no spaces allowed, name admin forbidden!
            'plugins',

            // command handler:
            this.commandPlugins,
            
            // command description:
            'Display plugins list',

            // this plugin's name:
            this.name
        ));

        // register admin commands like this:
        nextcontrol.registerAdminCommand(new Classes.ChatCommand(
            // name:
            'help',

            // handler:
            this.commandAdminHelp,

            // description:
            'This help, but for admins.',

            this.name
        ));

        // save the reference to the main class instance
        this.nextcontrol = nextcontrol;
    }

    /**
     * Help chat command!
     * @param {String} login Login of the player calling this command
     * @param {Array<String>} params Parameters passed by the player after the command (seperated by space)
     */
    async commandHelp(login, params) {
        
        // For allowed queries, look up the XML-RPC methods for the
        // TM2/020 dedicated server: https://doc.maniaplanet.com/dedicated-server/references/xml-rpc-methods

        var listArray = []

        this.nextcontrol.chatCommands.forEach(command=>{
            listArray.push(`$550/${command.commandName} $z$s- ${command.commandDescription} $08F$n(${command.pluginName})$z$s`)
        })

        this.nextcontrol.client.query('ChatSendServerMessageToLogin', ['\n$5A0---------- List of commands ----------$z$s\n' + listArray.join('\n'), login]);
    }

    /**
     * Plugin list chat command!
     * @param {String} login Login of the player calling this command
     * @param {Array<String>} params Parameters passed by the player after the command (seperated by space)
     */
     async commandPlugins(login, params) {
        
        // For allowed queries, look up the XML-RPC methods for the
        // TM2/020 dedicated server: https://doc.maniaplanet.com/dedicated-server/references/xml-rpc-methods

        var listArray = []

        this.nextcontrol.plugins.forEach(plugin=>{
            listArray.push(`$A50${plugin.name} $z$s- ${plugin.description}`)
        })

        this.nextcontrol.client.query('ChatSendServerMessageToLogin', ['\n$8F0---------- List of plugins loaded ----------$z$s\n' + listArray.join('\n'), login]);
    }

    /**
     * Help chat command for admins!
     * @param {String} login Login of the player calling this command
     * @param {Array<String>} params Parameters passed by the player after the command (seperated by space)
     */
    async commandAdminHelp(login, params) {

        // to access the main class instance, refer to this.nextcontrol, as the reference is stored there
        // if another plugin does something or information in that object is updated, it's visible here too
        // as we saved the reference we got passed in the constructor.

        var listArray = []

        this.nextcontrol.adminCommands.forEach(command=>{
            listArray.push(`$A50//${command.commandName} $z$s- ${command.commandDescription} $08F$n(${command.pluginName})$z$s`)
        })

        this.nextcontrol.client.query('ChatSendServerMessageToLogin', ['\n$A80---------- List of admin commands ----------$z$s\n' + listArray.join('\n'), login]);
    }

    // Not usable but not sure if I'll use it in the future, so I let as it is

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
     * Function run, when the server receives data from a player, transmitted as base64 encoded
     * @param {CallbackParams.TunnelData} params Callback params
     */
    async onTunnelDataReceived(params) {

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