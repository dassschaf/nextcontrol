/*
 *  NextControl Trackmania-XML-RPC wrapper class
 *  provides functions for immediate communication with the server returning typed objects
 */


import { logger } from './utilities.js';
import * as Classes from './classes.js';

/**
 * Wrapper object for the GBXRemote connection
 */
export class ClientWrapper {
    /**
     * Constructs a new Client 
     * @param {Object} client Gbxremote client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Gets Server version
     * @returns {Classes.ServerVersion} Version object
     */
    async getVersion() {
        let struct = await this.client.query('GetVersion');
        return new Classes.ServerVersion(struct);
    }

    /**
     * Gets Server status
     * @returns {Classes.ServerStatus} Status object
     */
    async getStatus() {
        let struct = await this.client.query('GetStatus');
        return new Classes.ServerStatus(struct);
    }

    async getPlayerInfo(login) {
        let struct = await this.client.query('GetPlayerInfo', [login, 1]);
        //logger(JSON.stringify(struct))
        return new Classes.PlayerInfo(struct);
    }

    async getMapsPath() {
        let path = String(await this.client.query('GetMapsDirectory'));
        return path;
    }

    async getCurrentMapInfo() {
        let struct = await this.client.query('GetCurrentMapInfo');
        return new Classes.Map(struct);
    }

    /**
     * Sends Message to all players in Chat
     * @param text message content 
     */
    async chatSendServerMessage(text) {
        await this.client.query('ChatSendServerMessage', [text]);
    }

    /**
     * Sends Message to a player with given login in chat
     * @param text Message text
     * @param login Player login
     */
    async chatSendServerMessageToLogin(text, login) {
        await this.client.query('ChatSendServerMessageToLogin', [text, login]);
    }

    /**
     * Sends Message to a list of players with given login in chat
     * @param text Message text
     * @param logins array of player logins
     */
    async chatSendServerMessageToLogins(text, logins) {
        let loginList = '';
        logins.forEach((login, i) => {
            if (i < logins.length - 1) loginList += login + ',';
            else loginList += login;
        });

        await this.chatSendServerMessageToLogin(text, loginList);
    }
}