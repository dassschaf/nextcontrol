import { NextControl } from "../../nextcontrol.js";

import {Settings} from '../../settings.js';
import * as Classes from "../classes.js";
const dbType = Settings.usedDatabase;

export class DbRecords {

    /**
     * NextControl main object reference
     * @type {NextControl}
     */
    nc

    /**
     * Constructs a new library instance
     * @param {NextControl} nc 
     */
    constructor(nc) {
        this.nc = nc;
    }

    /**
     * Returns all records driven on a given map from the database
     * @param {String} uid Map's UID
     * @returns {Promise<Array<Classes.LocalRecord>>}
     */
    async getMapRecords(uid) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
            let cursor = await this.nc.mongoDb.collection('records').find({ map: uid });

            return cursor.toArray();
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {
        }
    }

    /**
     * Returns a record from the database specified by map UID and player login
     * @param {String} uid 
     * @param {String} login 
     * @returns {Promise<Classes.LocalRecord>}
     */
    async getRecord(uid, login) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
            let cursor = await this.nc.mongoDb.collection('records').findOne({ map: uid, login: login });
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {
        }
    }

    /**
     * Returns the rank of a record specified by map UID and player login
     * @param {String} uid 
     * @param {String} login 
     * @returns {Promise<Number>} Rank
     */
    async getRecordRank(uid, login) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
            
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {
        }
    }

    /**
     * Inserts or updates a record in the database
     * @param {Classes.LocalRecord} record 
     */
    async upsertRecord(record) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {
        }
    }
    
    /**
     * Returns the number of records on a given map
     * @param {String} uid Map's UID
     * @returns {Promise<Number>} Number of records
     */
    async getMapRecordsCount(uid) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
            return await this.nc.mongoDb.collection('records').countDocuments({ map: uid });
        }

        if (dbType.toLocaleLowerCase() === 'mysql') {
            const sql = `
            SELECT COUNT(*) AS count
            FROM records
            WHERE map = ${uid}
            `;

            const result = await this.nc.mysql.query(sql);
        }
    }


}