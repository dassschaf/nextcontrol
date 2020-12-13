/**
 * Nextcontrol Function library for database interaction
 *
 * Type definition file
 */

//---------
// imports:
import { NextControl } from "../nextcontrol.js";
import * as Classes from './classes.js';
//---------

export class DatabaseLib {
    /**
     * Main object reference
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Constructs the database library
     * @param {NextControl} nextcontrol
     */
    constructor(nextcontrol)

    /**
     * Returns the player info of a player from the database
     * @param {String} login
     * @returns {Promise<Classes.PlayerInfo>} Player document as in database, may contain more information than the class object have
     */
     getPlayerInfo(login) : Promise<Classes.PlayerInfo>
}
