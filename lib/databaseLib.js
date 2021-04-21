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
     * Construct Database library
     * @param {NextControl} nextcontrol
     */
    constructor(nextcontrol) {
        // save reference to main object
        this.nextcontrol = nextcontrol;
    }

    /**
     * Returns the player info of a player from the database
     * @param {String} login
     * @returns {Promise<Classes.PlayerInfo>}
     */
    async getPlayer(login) {
        return await this.nextcontrol.database.collection('players').findOne({login: login});
    }

    async getPlayerList() {}

    /**
     * Updates a player's data in the database or inserts, if there's none yet
     * @param {Classes.PlayerInfo} player Player info object
     * @returns {Promise<void>}
     */
    async upsertPlayer(player) {}

    /**
     * Checks if a player exists in the database or not
     * @param {String} login Player login
     * @returns {Promise<Boolean>}
     */
    async existsPlayer(login) {}

    async existsMap(uid) {}

    async getMap(uid) {}

    async getMapList() {}

    async upsertMap(map) {}

    async getRecord(map, login) {}

    async getRecordListOnMap(map) {}

    async getRecordRank(record) {}

    async upsertRecord(record) {}

    async upsertSetting(plugin, settingsJSON) {}

    async getSetting(plugin) {}

    /**
     * Checks if all necessary collections exist in the Mongodb database and creates them if necessary
     * @returns {Promise<void>}
     */
    async mongodbCheckCollections() {
        // List of required collections
        const reqCollections = ['players', 'maps', 'records', 'settings'];

        // get arrays of collections
        let existingCollections = await this.nextcontrol.database.listCollections({}, {nameOnly: true}).toArray(); // Array of objects {name: '', type: ''}
        let missingCollections = [];

        // check if a collection is missing
        reqCollections.forEach(c => {
            let exists = false;

            // oddity due to the Array<{name: '', type: ''}>
            existingCollections.forEach(item => {
                exists = exists || (item.name === c);
            })

            // add collection from the required list to the missing list
            if (!exists) {
                missingCollections.push(c);
            }
        })

        // no collections missing, so we can abort here already
        if (missingCollections.length === 0)
            return;

        // create missing collections
        for (const c of missingCollections) {
            await this.nextcontrol.database.createCollection(c);
        }
    }
}
