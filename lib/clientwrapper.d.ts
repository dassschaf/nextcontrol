/*
 *  NextControl wrapper for common 
 *  Type Definitions file
 */



import * as Classes from './classes.js';

export class ClientWrapper {
    /**
     * Constructs the client wrapper object
     * @param client connected GBXremote client
     */
    constructor(client : any)

    /**
     * Returns the server version info
     */
    async getVersion()  : Classes.ServerVersion

    /**
     * Returns the current server status
     */
    async getStatus()   : Classes.ServerStatus

    /**
     * Returns the player info of a given player
     * @param login player's login
     */
    async getPlayerInfo(login : string) : Classes.PlayerInfo

    /**
     * Returns the absolute path to the server's .../UserData/Maps directory
     */
    async getMapsPath() : string

    /**
     * Sends Message to all players in Chat
     * @param text message content 
     */
    async chatSendServerMessage(text : string) : void

    /**
     * Sends Message to a player with given login in chat
     * @param text Message text
     * @param login Player login
     */
    async chatSendServerMessageToLogin(text : string, login : string) : void

    /**
     * Sends Message to a list of players with given login in chat
     * @param text Message text
     * @param logins array of player logins
     */
    async chatSendServerMessageToLogins(text : string, logins : Array<string>) : void 
}