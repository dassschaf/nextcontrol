
import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { Settings } from '../settings.js'

import { ClientWrapper } from '../lib/clientwrapper.js'
import { DatabaseWrapper } from '../lib/dbwrapper.js'
import * as CallbackParams from '../lib/callbackparams.js'
import * as Classes from '../lib/classes.js'

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
     * Constructor, putting the wrapper objects into the plugin class. Don't change this!
     * @param {Classes.WrapperList} conns wrapper object list
     */
    constructor(conns) {
        this.client = conns.client;
        this.database = conns.database;
    }

    /**
     * Function run, when a player joins the server
     * @param {CallbackParams.PlayerConnect} params Callback parameters
     */
    onPlayerConnect(params) {

    }

    /**
     * Function run, when a player disconnects the server
     * @param {CallbackParams.PlayerDisconnect} params Callback parameters
     */
    onPlayerDisconnect(params) {

    }

    /**
     * Function run, when a new map begins
     * @param {Classes.Map} params Callback parameters
     */
    onBeginMap(params) {

    }

    /**
     * Function run, when a new match begins
     * ... has no parameters!
     */
    onBeginMatch() {

    }

    /**
     * Function run, when a started transaction's bill is updated
     * @param {CallbackParams.UpdatedBill} params Callback parameters
     */
    onBillUpdate(params) {

    }

    /**
     * Function run, when a map ends
     * @param {Classes.Map} params Callback parameters
     */
    onEndMap(params) {

    }

    /**
     * Function run, when a match ends
     * @param {CallbackParams.MatchResults} params Callback parameters
     */
    onEndMatch(params) {

    }

    /**
     * Function run, when the maplist changes
     * @param {CallbackParams.MaplistChange} params Callback parameters
     */
    onMaplistChange(params) {

    }

    /**
     * Function run, when a gamemode script triggers a callback
     * @param {CallbackParams.ModeScriptCallback} params Callback parameters
     */
    onModeScriptCallback(params) {

    }

    /**
     * Function run, when a player switches teams (??)
     * @param {string} login Player's login
     */
    onPlayersAlliesChange(login) {

    }

    /**
     * Function run, when a player's info changes
     * @param {Classes.PlayerInfo} params Callback parameters
     */
    onPlayerInfoChange(params) {

    }

    /**
     * Function run, when a player interacts with a displayed manialink
     * @param {CallbackParams.ManialinkPageAnswer} params Callback parameters
     */
    onManialinkPageAnswer(params) {

    }

    /**
     * Function run, when the server transitions from one state to another
     * @param {Classes.ServerStatus} params Server Status object
     */
    onStatusChange(params) {
        
    }

    /**
     * Function run, when the server recieves data from a player, transmitted as base64 encoded
     * @param {CallbackParams.TunnelData} params Callback params
     */
    onTunnelDataRecieved(params) {

    }

    /**
     * Function run, when a callvote is updated
     * @param {Classes.CallVote} params Callback params
     */
    onVoteUpdate(params) {

    }    

    /**
     * Function run, when a player passes a checkpoint (be careful, this one might happen very often!)
     * @param {CallbackParams.PlayerCheckpoint} params Callback params
     */
    onCheckpoint(params) {

    }

    /**
     * Function run, when a player passes the finish line and finishes their run
     * @param {CallbackParams.PlayerFinish} params Callback params
     */
    onFinish(params) {

    }

    /**
     * Function run, when a player's run in invalidated
     * @param {CallbackParams.PlayerIncoherence} params Callback params
     */
    onIncoherence(params) {

    }

}