import { NextControl } from "../../nextcontrol.js";
import  * as Classes from "../classes.js";

import {Settings} from '../../settings.js';
const dbType = Settings.usedDatabase;

export class DbMaps {

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
     * Inserts or updates a map in the database
     * @param {Classes.Map} map 
     */
    async upsertMap(map) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
            await this.nc.mongoDb.collection('maps').updateOne({uid: map.uid}, {$set: map}, {upsert: true})
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {

            const sql = `
            INSERT INTO maps (uid, name, file, author, mood, medals, coppers, isMultilap, nbLaps, nbCheckpoints, type, style, tmxid)
            VALUES("${map.uid}", "${map.name}", "${map.file}", "${map.author}", "${map.mood}", "${map.medals}", "${map.coppers}", "${map.isMultilap}", "${map.nbLaps}", "${map.nbCheckpoints}", "${map.type}", "${map.style}", "${map.tmxid}")
            ON DUPLICATE KEY UPDATE
                uid = "${map.uid}",
                name = "${map.name}",
                file = "${map.file}",
                author = "${map.author}",
                mood = "${map.mood}",
                medals = "${map.medals}",
                coppers = ${map.coppers},
                isMultilap = ${map.isMultilap ? 1 : 0},
                nbLaps = ${map.nbLaps},
                nbCheckpoints = ${map.nbCheckpoints},
                type = "${map.type}",
                style = "${map.style}",
                tmxid = ${map.tmxid}
            `;

        }
    }

    /**
     * Returns a map from the database based upon the UID of the map
     * @param {string} uid 
     * @returns {Classes.Map} Map object
     */
    async getMap(uid) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
            return Classes.Map.fromDb(await this.nc.mongoDb.collection('maps').findOne({uid : uid}));
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {
            const sql = `
                SELECT * FROM maps 
                WHERE uid = "${uid}"
                LIMIT 1;
            `;

            let map = (await this.nc.mysql.query(sql))[0];

            // convert bit number to boolean
            map.isMultilap = map.isMultilap == 0 ? true : false;

            return map;
        }
    }

    // possibly: getMaps?

    /**
     * Checks if a map exists in the database with a given UID
     * @param {string} uid 
     * @returns {Boolean} true/false
     */
    async existsMap(uid) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
            return (await this.mongoDb.collection('maps').countDocuments({uid : p.uid})) > 0;
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {
            const sql = `
                SELECT count(uid) AS "amount" FROM maps
                WHERE uid = "${uid}"
            `;

            return (await this.nc.mysql.query(sql))[0]["amount"] > 0;
        }
    }

}