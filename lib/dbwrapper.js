import { Settings } from '../settings.js';
import { logger } from './utilities.mjs';

/**
 * Wrapper object for Database connection
 */
class DatabaseWrapper {

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

    async updateMapInfo(map) {

    }

    async getMapInfo(uid) {

    }

}

export { DatabaseWrapper }
