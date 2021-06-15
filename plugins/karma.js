
import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { Settings } from '../settings.js'

import * as CallbackParams from '../lib/callbackparams.js'
import * as Classes from '../lib/classes.js'
import { NextControl } from '../nextcontrol.js'

/**
 * Heavily documented sample plugin, allowing you to jump immediately into plugin development
 */
export class KarmaPlugin {

    /**
     * Plugin name
     */
    name           = 'Karma'

    /**
     * Plugin author
     */
    author         = 'dassschaf'

    /**
     * Plugin description
     */
    description    = 'Plugin allowing players to vote for tracks from 0 to 10.'

    /**
     * Local reference to the main class instance
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nextcontrol The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) {



        // save the reference to the main class instance
        this.nextcontrol = nextcontrol;
    }

    /**
     * Karma chat command
     * @param {String} login Login of the player calling this command
     * @param {Array<String>} params Parameters passed by the player after the command (seperated by space)
     */
    async commandKarma(login, params) {
        if (params.length === 1) {
            // vote
        }

        if (params.length === 0) {
            // show karma
        }
    }

    /***
     * Prints the current track Karma to chat.
     * @param uid
     * @returns {Promise<void>}
     */
    async showKarma(uid) {

    }


    /**
     * Function run, when a new map begins
     * @param {Classes.Map} params Callback parameters
     */
    async onBeginMap(params) {

    }

    /**
     * Function run, when a map ends
     * @param {Classes.Map} params Callback parameters
     */
    async onEndMap(params) {

    }

}

export class KarmaVote {

    // Player login
    login

    // Map voted on
    map

    // Player's score
    score = 0

    // Validity check
    isValid() {
        return (this.score >= 0 && this.score <= 0)
    }

    // Constructor
    KarmaVote(_login, _map, _score) {
        this.login = _login;
        this.map = _map;
        this.score = _score;
    }
}