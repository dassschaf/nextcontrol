

import { Settings } from '../settings.js';
import { logger } from './utilities.js';
import * as Classes from './classes.js';

/**
 * Wrapper object for Database connection
 */
export class DatabaseWrapper {

    constructor(database) {
        this.database = database;
    }

    async updatePlayerInfo(playerInfo) {
        if ((await this.database.collection('players').countDocuments({ login: playerInfo.login })) < 1)
            await this.database.collection('players').insertOne(playerInfo);
        else
            await this.database.collection('players').updateOne({ login: playerInfo.login }, { $set: playerInfo });
    }

    async getPlayerInfo(login) {
        let result = await this.database.collection('players').findOne({ login: login });

        if (result) {
            //logger(JSON.stringify(result));
            return result;
        } else {
            return null;
        }
    }

    /**
     * Updates a map's database entry
     * @param {Classes.Map} map map object
     */
    async updateMapInfo(map) {
        let uid = map.uid;

        if ((await this.database.collection('maps').countDocuments({ uid: uid })) < 1)
            await this.database.collection('maps').insertOne(map);

        else
            await this.database.collection('players').updateOne({ uid: map.uid }, { $set: map });
    }

    /**
     * Returns the map info object from database for a track with given UID
     * @param {string} uid map uid
     */
    async getMapInfo(uid) {
        let result = await this.database.collection('maps').findOne({ uid: uid })
        return (result ? result : null);
    }
    
    /**
     * Updates the map's associated TMX id 
     * @param {string} uid map uid
     * @param {number} id map tmx id
     */
    async updateMapTMXId(uid, id) {
        await this.database.collection('maps').updateOne({ uid: uid }, { $set: { tmxid: id }});
    }

    /**
     * Updates a local record on a given track by a given author
     * @param login player login
     * @param time score or time
     * @param track track uid
     */
    async updateLocalRecord(login, time, track) {
        
    }

    /**
     * Returns all local records on a track or the local record driven by the player with the specified login, if the login is passed
     * @param track track's UID
     * @param login player login
     */
    async getLocalRecord(track, login) {

    }

}

