import { Db } from "mongodb"
import * as Classes from './classes.js'

/**
 * Wrapper object for Database connection
 */
export class DatabaseWrapper {

    constructor (database : any)

    database : Db

    /**
     * Updates a player's document in the database
     * @param playerInfo Player info meant to be updated
     */
    async updatePlayerInfo(playerInfo : Classes.PlayerInfo) : void

    /**
     * REturns a player's document from the database
     * @param login searched player's login
     */
    async getPlayerInfo(login : string) : Classes.PlayerInfo | null

    /**
     * Updates a local record on a given track by a given author
     * @param login player login
     * @param time score or time
     * @param track track uid
     */
    async updateLocalRecord(login : string, time : number, track : string)

    /**
     * Returns all local records on a track or the local record driven by the player with the specified login, if the login is passed
     * @param track track's UID
     * @param login player login
     */
    async getLocalRecord(track : string, login? : string)

    /**
     * Updates the map info in the database, based on the map's UID
     * @param map map object
     */
    async updateMapInfo(map : Classes.Map)

    /**
     * Returns the map object of a map from the database
     * @param uid track uid
     */
    async getMapInfo(uid : string)

}