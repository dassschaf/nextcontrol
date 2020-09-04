// set of functions to facilitate server communication
import { logger } from './utilities.mjs';
import { ServerVersion, ServerStatus, PlayerInfo } from './classes.mjs';

/**
 * Wrapper object for the GBXRemote connection
 */
class ClientWrapper {
    /**
     * Constructs a new Client 
     * @param {Object} client Gbxremote client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Gets Server version
     * @returns {ServerVersion} Version object
     */
    async getVersion() {
        let struct = await this.client.query('GetVersion');
        return new Version(struct);
    }

    /**
     * Gets Server status
     * @returns {ServerStatus} Status object
     */
    async getStatus() {
        let struct = await this.client.query('GetStatus');
        return new ServerStatus(struct);
    }

    async getPlayerInfo(login) {
        let struct = await this.client.query('GetPlayerInfo', [login, 1]);
        //logger(JSON.stringify(struct))
        return new PlayerInfo(struct);
    }

    async getMapsPath() {
        let path = await this.client.query('GetMapsDirectory');
        return path;
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

export { ClientWrapper };