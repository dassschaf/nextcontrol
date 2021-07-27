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
import path from "path";


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

            let res = await this.nextcontrol.mysql.query(sql).catch((e)=>{
                logger('er', 'MySQL database error: ' + JSON.stringify(e, null, 2));
                process.exit(7);
            });

            // TODO: check if the result is bad

            return res[0];
        }
    }

    /**
     * Updates a player's data in the database or inserts, if there's none yet
     * @param {Classes.PlayerInfo} player Player info object
     * @returns {Promise<void>}
     */
    async upsertPlayer(player) {

        if (DB === 'mongodb') {

        }

        else {



        }

    }

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

            logger('w', 'Created missing MongoDB collection "' + c + '".');
        }
    }

    /**
     *  Temporary version.
     *  Checks if all necessary tables exist in the MySQL database and creates them if necessary
     *  @returns {Promise<void>}
     *
     *  Altering correct tables could cause error, if primary key already defined
     *  Don't know yet how to implement it correctly through mariadb connector
     *  Going to work on implementation this functionality in nextcontrol.sql
     */
    async mysqlCheckTables() {
        // TODO: Upgrade 'nextcontrol.sql', delete sql folder, remove this function
        //List of required tables
        const reqTables = ['players', 'maps', 'records', 'settings', 'karma'];

        //SQL syntax to get existing tables
        const sql = `SHOW TABLES;`

        //get existing tables
        let existingTables = await this.nextcontrol.mysql.query(sql); // Array of objects {Tables_in_${database_name}: '${table_name}'}
        let missingTables = [];

        reqTables.forEach(c => {
            let exists = false;

            // oddity due to the Array<{Tables_in_${database_name}: '${table_name}'}>
            existingTables.forEach(item => {
                exists = exists || (Object.values(item)[0] === c);
            })

            // add collection from the required list to the missing list
            if (!exists) {
                missingTables.push(c);
            }
        })

        // no tables missing, so we can abort here already
        if (missingTables.length === 0)
            return;

        // create missing tables
        for (const c of missingTables) {


            //get path to file with CREATE TABLE sql syntax
            let pathToCreateTableFile = path.resolve('databases/sql', c);

            //get sql from file
            let sqlToCreateTable = await fs.promises.readFile(pathToCreateTableFile, 'utf-8').catch((e)=>{
                logger('er', 'FileSystem Error: ' + JSON.stringify(e, null, 2));
                process.exit(7);
            });

            //create missing table
            await this.nextcontrol.mysql.query(sqlToCreateTable).catch((e)=>{
                logger('er', 'MySQL database error: ' + JSON.stringify(e, null, 2));
                process.exit(7);
            });

            logger('w', 'Created missing mysql tables "' + c + '".');
        }

    }

}
