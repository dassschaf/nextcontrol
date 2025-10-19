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

import { logger } from './utilities.js';

import { Settings } from "../settings.js";
import {Logger} from "./logger.js";


//---------
// constants
const DB = Settings.usedDatabase.toLocaleLowerCase();


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

    // TODO: add equivalent functions for MySQL databases

    /**
     * Returns the player info of a player from the database
     * @param {String} login
     * @returns {Promise<Classes.PlayerInfo>}
     */
    async getPlayer(login) {
        if (DB === 'mongodb')
            return await this.nextcontrol.mongoDb.collection('players').findOne({login: login});

        else {
            const sql = `
                SELECT * FROM players
                WHERE login = "${login}"
                LIMIT 1
            `;

            let res = await this.nextcontrol.mysql.query(sql);

            // TODO: check if the result is bad

            return res[0];
        }
    }

    async getPlayerList() {

        if (DB === 'mongodb') {
            
        }

        else {

        }

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
        const reqCollections = ['players', 'maps', 'records', 'settings', 'karma'];

        // get arrays of collections
        let existingCollections = await this.nextcontrol.mongoDb.listCollections({}, {nameOnly: true}).toArray(); // Array of objects {name: '', type: ''}
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
            await this.nextcontrol.mongoDb.createCollection(c);

            Logger.warning('Created missing MongoDB collection "' + c + '".');
        }
    }

    async mysqlCheckTables() {
        // TODO.
    }

}
