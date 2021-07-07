
import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { Settings } from '../settings.js'

import * as CallbackParams from '../lib/callbackparams.js'
import * as Classes from '../lib/classes.js'
import { NextControl } from '../nextcontrol.js'
import * as Discord from 'discord.js'

/**
 * Discord bot integration
 * @GreepTheSheep
 */
export class DiscordBot {
    name           = 'Discord Bot Integration'
    author         = 'Greep'
    description    = 'Integrate your TM server with your Discord server'
    version        = "0.0.1"

    /**
     * Local reference to the main class instance
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Local reference to Discord Client
     * @type {Discord.Client}
     * @private
     */
    discordClient

    /**
     * Settings that will be dedected
     * @type {Object}
     * @private
     */
    settings = {
        /**
         * Enabling log channel
         * @type {Boolean}
         */
        enableLogChannel: true
    }

    /**
     * Integrate your TM server with your Discord server
     * @param {NextControl} nextcontrol The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) {

        if (!Settings.discord.token || Settings.discord.token == "") return false;
        if (!Settings.discord.logChannel || Settings.discord.logChannel == "") this.settings.enableLogChannel = false;

        this.discordClient = new Discord.Client()
        this.discordClient.login(Settings.discord.token).catch(err=>{
            if (err.code == "TOKEN_INVALID"){
                logger('er', 'Discord: ' + err.message + " Double-check your token")
            } else {
                logger('er', 'Discord: ' + err.message)
            }
            Settings.admins.forEach(adminLogin=>{
                nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.discord.prefix.error + err.message, adminLogin])
            })
            this.discordClient = null
        })

        this.discordClient.on('ready', ()=>{
            if (this.settings.enableLogChannel) this.discordClient.channels.fetch(Settings.discord.logChannel).then(channel=>{
                let embed = new Discord.MessageEmbed();
                embed.setColor('#00FF00')
                .setTitle(Sentences.discord.logReady.title)
                .setDescription(
                    format(Sentences.discord.logReady.playersOnline, {nbPlayers: this.nextcontrol.status.players.length}) +
                    "\n\n" +
                    format(Sentences.discord.logReady.actualMap, { mapName: stripFormatting(this.nextcontrol.status.map.name), mapAuthor: this.nextcontrol.status.map.author })
                )
                channel.send(embed)
            })
        })

        // save the reference to the main class instance
        this.nextcontrol = nextcontrol;
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
        if (this.settings.enableLogChannel){
            this.discordClient.channels.fetch(Settings.discord.logChannel).then(channel=>{
                let embed = new Discord.MessageEmbed();
                embed.setColor(isSpectator ? "#00FF88" : "#00FF00")
                .setTitle(Sentences.discord.joinMessage.title)
                .setDescription(format(isSpectator ? Sentences.discord.joinMessage.specJoin : Sentences.discord.joinMessage.normalJoin, { player: player.name, login: player.login }))
                channel.send(embed)
            })
        }
    }

    /**
     * Function run, when a player sends a chat message or command
     * DO NOT use this for handling commands, those are supposed to be registered at the main class
     * @param {String} login Player's login
     * @param {String} text Message text
     */
    async onChat(login, text) {
        if (this.settings.enableLogChannel && Settings.discord.logChat){
            this.discordClient.channels.fetch(Settings.discord.logChannel).then(channel=>{
                channel.send(`SERVER CHAT: \`${new Date().toUTCString()}\` ${this.nextcontrol.status.getPlayer(login).name} (\`${login}\`):\n${text}`)
            })
        }
    }

    /**
     * Function run, when a player disconnects
     * @param {Classes.PlayerInfo} player Playerinfo of leaving player 
     * @param {String} reason Reason for disconnection
     */
    async onPlayerDisconnect(player, reason) {
        if (this.settings.enableLogChannel){
            this.discordClient.channels.fetch(Settings.discord.logChannel).then(channel=>{
                if (player.name == '' && player.login == ''){ // Server shutdown
                    let embed = new Discord.MessageEmbed();
                    embed.setColor("#FF0000")
                    .setTitle(Sentences.discord.serverShutdown.title)
                    .setDescription(Sentences.discord.serverShutdown.description)
                    channel.send(embed)
                } else { // Player disconnect
                    let embed = new Discord.MessageEmbed();
                    embed.setColor("#FF8800")
                    .setTitle(Sentences.discord.leftMessage.title)
                    .setDescription(format(Sentences.discord.leftMessage.description, { player: player.name, login: player.login }))
                    channel.send(embed)
                }
            })
        }
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