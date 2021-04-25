/**
 * Nextcontrol Function library for dedicated server interaction
 *
 * Type definition file.
 */
import {NextControl} from "../nextcontrol";
import * as Classes from './classes.js';


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
    constructor(nextcontrol : NextControl)

    /**
     * Sends a chat message to everyone
     * @param {String} message Message string
     * @returns {Promise<void>}
     */
    chatMessage(message : String) : Promise<void>

    /**
     * Sends a chat message to a player given by login
     * @param {String} login Player login
     * @param {String} message Message string
     * @returns {Promise<void>}
     */
    chatMessageToLogin(login : String, message : String) : Promise<void>

    /**
     * Returns the current map info
     * @returns {Promise<Classes.Map>}
     */
    getCurrentMapInfo() : Promise<Classes.Map>

    /**
     * Returns the map info of a map given by a path
     * @param {String} path Complete path to file
     * @returns {Promise<Classes.Map>}
     */
    getMapInfo(path : String) : Promise<Classes.Map>

}
