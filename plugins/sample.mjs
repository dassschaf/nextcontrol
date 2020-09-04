/**
 * featureless, fully complete sample Plugin
 * @property name           - Plugin name
 * @property author         - Plugin author
 * @property description    - Plugin description
 * @property client         - TM Server client wrapper
 * @property database       - Database client wrapper
 */
export class SamplePlugin {
    constructor(conns) {
        // plugin name:
        this.name           = 'Sample Plugin'
        this.author         = 'dassschaf'
        this.description    = 'Sample plugin containing the whole plugin structure'

        this.client = conns.client;
        this.database = conns.database;
    }

    /**
     * Function run, when a player joins the server
     * @param params Callback parameters
     */
    onPlayerConnect(params) {

    }   
}