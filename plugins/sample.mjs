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
     */
    onPlayerConnect(params) {
        
        // params.login         == player's login
        // params.isSpectator   == whether player joins as spectator or not

    }  

    /**
     * Function run, when a player leaves the server
     */
    onPlayerDisconnect(params) {

        // params.login     == player's login
        // params.reason    == disconnection reason

    }

    /**
     * Function run, when a chat message is sent
     */
    onChat(params) {

        // params.login == sender's login
        // params.text == message content
        // params.isCommand == whether the message is a command or not
    }
}