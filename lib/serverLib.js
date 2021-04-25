/**
 * Nextcontrol Function library for dedicated server interaction
 *
 * This library (in form of a class) offers a set of functions
 * to facilitate communication with the TM dedicated server
 */

//---------
// imports:
import { NextControl } from "../nextcontrol.js";
import * as Classes from './classes.js';
//---------

export class ServerLib {
    /**
     * Main object reference
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Constructs the library object and saves a reference to the main object
     * @param {NextControl} nextcontrol
     */
    constructor(nextcontrol) {
        // save reference to main object
        this.nextcontrol = nextcontrol;
    }

    /**
     * Sends a chat message to everyone
     * @param {String} message Message string
     * @returns {Promise<void>}
     */
    async chatMessage(message) {
        await this.nextcontrol.client.query('ChatSendServerMessage', [message]);
    }

    /**
     * Sends a chat message to a player given by login
     * @param {String} login Player login
     * @param {String} message Message string
     * @returns {Promise<void>}
     */
    async chatMessageToLogin(login, message) {
        await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [message, login]);
    }

    /**
     * Returns the current map info
     * @returns {Promise<Classes.Map>}
     */
    async getCurrentMapInfo() {
        return new Classes.Map(await this.nextcontrol.client.query('GetCurrentMapInfo', []));
    }

    /**
     * Returns the map info of a map given by a path
     * @param {String} path Complete path to file
     * @returns {Promise<Map>}
     */
    async getMapInfo(path) {
        return new Classes.Map(await this.nextcontrol.client.query('GetMapInfo', [path]));
    }

}
