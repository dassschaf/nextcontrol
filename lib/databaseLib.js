/**
 * Nextcontrol Function library for database interaction
 *
 * This library (in form of a class) offers a set of functions
 * to facilitate communication with the database
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
     *
     * @param {NextControl} nextcontrol
     */
    constructor(nextcontrol) {
        // save reference to main object
        this.nextcontrol = nextcontrol;
    }

    /**
     * Returns the player info of a player from the database
     * @param {String} login
     * @returns {Classes.PlayerInfo}
     */
    async getPlayerInfo(login) {
        return await this.nextcontrol.database.collection('players').findOne({login: login});
    }

}
