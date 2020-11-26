
import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { Settings } from '../settings.js'

import { ClientWrapper } from '../lib/clientwrapper.js'
import { DatabaseWrapper } from '../lib/dbwrapper.js'
import * as CallbackParams from '../lib/callbackparams.js'
import * as Classes from '../lib/classes.js'
import { NextControl } from '../nextcontrol.js'

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
    constructor(nc) {

        // register /admin restart
        nc.registerAdminCommand(new Classes.ChatCommand('restart', this.adminRestart, 'Restarts the current track.'));


    }

    /**
     * Function making the current track being restarted
     * @param {Classes.ChatCommandParameters} params 
     * @param {NextControl} nc 
     */
    adminRestart(params, nc) {
        // get title and player name
        

        nc.client.query('RestartMap').then(res => {
            nc.clientWrapper.chatSendServerMessage()
        });

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