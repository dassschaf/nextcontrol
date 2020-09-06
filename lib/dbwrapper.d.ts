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

    

}