// set of functions to facilitate server communication
import { log } from './utilities.mjs';
import { ServerVersion, ServerStatus } from './classes.mjs';

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
        log('dg', JSON.stringify(struct));
        return new ServerStatus(struct);
    }

    /**
     * Sends Message to all players in Chat
     * @param text message content 
     */
    chatSendServerMessage(text) {
        this.client.query('ChatSendServerMessage', [text]);
    }
}

export { ClientWrapper };