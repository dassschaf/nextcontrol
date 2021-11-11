/**
 * Nextcontrol Function library for database interaction
 *
 * This library (in form of a class) offers a set of functions
 * to facilitate communication with the database
 */

//---------
// imports:
import {NextControl} from "../nextcontrol.js";
import * as Classes from './classes.js';

import {logger} from './utilities.js';

import {Settings} from "../settings.js";
import fs from "fs";

import { DbKarma } from "./databases/karma.js";
import { DbMaps } from "./databases/maps.js";
import { DbPlayers } from "./databases/players.js";
import { DbRecords } from "./databases/records.js";


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
     * Karma functions
     * @type {DbKarma}
     */
    karma

    /**
     * Record functions
     * @type {DbRecords}
     */
    records

    /**
     * Player functions
     * @type {DbPlayers}
     */
    players

    /**
     * Maps functions
     * @type {DbMaps}
     */
    maps

    /**
     * Construct Database library
     * @param {NextControl} nextcontrol
     */
    constructor(nextcontrol) {
        // save reference to main object
        this.nextcontrol = nextcontrol;

        // add sub-classes to the object
        this.karma = new DbKarma(nextcontrol);
        this.records = new DbRecords(nextcontrol);
        this.players = new DbPlayers(nextcontrol);
        this.maps = new DbMaps(nextcontrol);
    }

    
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

            logger('w', 'Created missing MongoDB collection "' + c + '".');
        }
    }

    /**
     *  Execute sql script which checks if all necessary tables exist in the MySQL database and creates them if necessary
     *  @returns {Promise<void>}
     **/
    async mysqlCheckTables() {
        //get sql from file
        let sqlToCreateMissingTables = await fs.promises.readFile('databases/nextcontrol.sql', 'utf-8').catch((e) => {
            logger('er', 'FileSystem Error: ' + JSON.stringify(e, null, 2));
            process.exit(7);
        });

        //remove all unnecessary symbols акщь ыйд
        let formattedSql = sqlToCreateMissingTables.replace(/\r\n/g, ' ');

        //split sql to single queries
        let queries = formattedSql.split(';')

        // create tables if missing
        for (const query of queries) {

            //evade case with whitespace query
            if (query.length > 1) {

                //create table if missing
                await this.nextcontrol.mysql.query(query).catch((e) => {
                    logger('er', 'MySQL database error: ' + JSON.stringify(e, null, 2));
                    process.exit(7);
                });

                logger('w', 'Created missing mysql table "' + query + '".');
            }
        }

    }

}
