import {NextControl} from '../../nextcontrol.js';
import {Settings} from '../../settings.js';
import * as Classes from '../classes.js';
import {logger} from "../utilities";

const dbType = Settings.usedDatabase;

export class DbPlayers {

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
        // save main object reference
        this.nc = nc;
    }


    /**
     * Returns a player info object from the database
     * @param {String} login Player login
     * @returns {Promise<Classes.PlayerInfo>} Player Info object
     */
    async getPlayer(login) {

        if (dbType.toLocaleLowerCase() === 'mongodb') {

            return await this.nc.mongoDb.collection('players').findOne({login: login});

        }

        if (dbType.toLocaleLowerCase() === 'mysql') {

            const sql = `
                SELECT * FROM players
                WHERE login = "${login}"
                LIMIT 1
            `;

            let res = await this.nc.mysql.query(sql).catch((e)=>{
                logger('er', 'MySQL database error: ' + JSON.stringify(e, null, 2));
                process.exit(7);
            })

            return res[0];

        }

    }

    /**
     * Inserts a player to the database or updates if it exists already.
     * @param {Classes.PlayerInfo} player Player info object
     * @returns {Promise<void>}
     */
    async upsertPlayer(player) {

        if (dbType.toLocaleLowerCase() === 'mongodb') {

            await this.nc.mongoDb.collection('players').updateOne({login: player.login}, {$set: player}, {upsert: true})

        }

        if (dbType.toLocaleLowerCase() === 'mysql') {

            const sql = `
            INSERT INTO players (login, name)
            VALUES("${player.login}", "${player.name}")
            ON DUPLICATE KEY UPDATE
                login = "${player.login}",
                name = "${player.name}"
            `;

            let res = await this.nc.mysql.query(sql).catch((e)=>{
                logger('er', 'MySQL database error: ' + JSON.stringify(e, null, 2));
                process.exit(7);
            });
        }

    }

    /**
     * Returns whether a player already exists in the database or not
     * @param {Classes.PlayerInfo} player 
     */
    async existsPlayer(player) {

        if (dbType.toLocaleLowerCase() === 'mongodb') {
            
            return await this.nc.mongoDb.collection('players').countDocuments({login: player.login}) == 1;

        }

        if (dbType.toLocaleLowerCase() === 'mysql') {
            
            const sql = `
            SELECT COUNT(login) AS "number" FROM players
            WHERE login = "${player.login}"
            `

            let res = await this.nc.mysql.query(sql).catch((e)=>{
                logger('er', 'MySQL database error: ' + JSON.stringify(e, null, 2));
                process.exit(7);
            });

            return res[0].number === 1;
        }

    }

    /**
     * Removes a player from the database
     * @param {Classes.PlayerInfo} player 
     */
    async removePlayer(player) {

        if (dbType.toLocaleLowerCase() === 'mongodb') {

            await this.nc.mongoDb.collection('players').deleteOne({login: player.login});
            
            return;

        }

        if (dbType.toLocaleLowerCase() === 'mysql') {

            const sql = `
            DELETE FROM players
            WHERE login = "${player.login}"
            `

            let res = await this.nc.mysql.query(sql).catch((e)=>{
                logger('er', 'MySQL database error: ' + JSON.stringify(e, null, 2));
                process.exit(7);
            });

        }

    }

}
