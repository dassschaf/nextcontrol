import { NextControl  } from "../nextcontrol.js";
import { WaypointInfo } from "../lib/classes.js";
import { MatchResults } from "../lib/callbackparams.js";

// Player Statistics plugin
export class PlayerStatsPlugin {

    // Plugin Name
    name = 'Player Statistics'

    // Plugin author
    author = 'dassschaf'

    // Plugin description
    description = 'Provides player statistics on the server.'

    /**
     * Contains the time of joining when a player joins the server
     * @type {Map<string, Number>}
     */
    joinTimes

    /**
     * Constructs the plugin.
     * @param {NextControl} nc
     */
    constructor(nc) {
        // save reference
        this.nc = nc;

        // create help variables:
        this.joinTimes = new Map();

        // add collection requirement -- data is stored in playerStats as documents specified by the PlayerStats class
        this.nc.addRequiredCollection('playerStats');
    }

    /**
     * Saves the player stats to the database
     * @param {PlayerStats} stats
     * @returns {Promise<void>}
     */
    async saveStats(stats) {
        await this.nc.mongoDb.collection('playerStats').updateOne({login: stats.login}, {$set: stats}, {upsert: true});
    }

    /**
     * Loads the player statistics from database or creates a new object if none can be found.
     * @param {String} login
     * @returns {Promise<PlayerStats>}
     */
    async loadStats(login) {
        if (await this.nc.mongoDb.collection('playerStats').countDocuments({login: login}) === 1)
            return await this.nc.mongoDb.collection('playerStats').findOne({login: login});
        else
            return new PlayerStats(login);
    }

    /**
     * Run on player connection
     * @param {String} login
     * @param {Boolean} isSpec
     * @returns {Promise<void>}
     */
    async onPlayerConnect(login, isSpec) {
        // TODO: increase join number

        this.joinTimes.set(login, Date.now());
    }

    /**
     * Run on player passing waypoint
     * @param {WaypointInfo} waypointInfo
     * @returns {Promise<void>}
     */
    async onWaypoint(waypointInfo) {
        // TODO: increase finish number if finished
        // TODO: increase passed checkpoint number if cp
    }

    /**
     * Run when a player leaves the server
     * @param {String} login
     * @param {String} reason
     * @returns {Promise<void>}
     */
    async onPlayerDisconnect(login, reason) {
        // get time difference, in ms
        let playedTime = Date.now() - this.joinTimes.get(login);

        // convert to minutes
        let minutes = Math.floor((playedTime) / (1000 * 60));

        // TODO: update player record
    }

    /**
     * Run on the end of a match
     * @param {MatchResults} results
     * @returns {Promise<void>}
     */
    async onEndMatch(results) {
        // TODO: add win to winner
    }
}

/**
 * Class describing the player statistics, giving the structure of database documents used by this plugin
 */
export class PlayerStats {

    /**
     * Constructs an empty instance for player 'login'.
     * @param {String} login
     */
    constructor(login) {
        // initialize variables:
        this.login = login;
        this.wins = 0;
        this.timePlayed = 0;
        this.connections = 0;
        this.finishes = 0;
        this.checkpoints = 0;
    }

    /**
     * Player login
     * @type {String}
     */
    login

    /**
     * Number of wins
     * @type {Number}
     */
    wins

    /**
     * Minutes spent on this server
     * @type {Number}
     */
    timePlayed

    /**
     * Times joined the server
     * @type {Number}
     */
    connections

    /**
     * Times finished a map
     * @type {Number}
     */
    finishes

    /**
     * Times passed a checkpoint
     * @type {Number}
     */
    checkpoints
}