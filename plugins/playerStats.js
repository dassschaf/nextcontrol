import { ClientWrapper } from '../lib/clientwrapper.js'
import { DatabaseWrapper } from '../lib/dbwrapper.js'
import * as CallbackParams from '../lib/callbackparams.js'
import * as Classes from '../lib/classes.js'

/**
 * Plugin tracking various statistics of players on this server
 */
export class PlayerStatistics {
    name           = 'Player Statistics'
    author         = 'dassschaf'
    description    = 'Plugin tracking various statistics of players on this server'

    /**
     * Constructor, putting the wrapper objects into the plugin class
     * @param {Classes.WrapperList} conns wrapper object list
     */
    constructor(conns) {
        // set up connections:
        this.client = conns.client;
        this.database = conns.database;
    }

}