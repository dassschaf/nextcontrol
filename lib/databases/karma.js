import { NextControl } from "../../nextcontrol.js";
import { KarmaVote } from "../../plugins/karma.js";

import {Settings} from '../../settings.js';
const dbType = Settings.usedDatabase;

export class DbKarma {

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
        this.nc = nc;
    }

    /**
     * Gets the vote of a player from the database
     * @param {String} uid 
     * @param {String} login 
     * @param {Promise<KarmaVote>}
     */
    async getVote(uid, login) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {
        }
    }

    /**
     * Returns all votes on a given map
     * @param {String} uid 
     * @returns {Promise<KarmaVote[]>}
     */
    async getMapVotes(uid) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {
        }
    }

    /**
     * Returns the karma score of a given map
     * @param {String} uid 
     * @returns {Promise<Number>}
     */
    async getMapScore(uid) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {
        }
    }

    /**
     * Returns whether a player has voted or not on a given map
     * @param {String} uid 
     * @param {String} login 
     * @returns {Promise<Boolean>}
     */
    async hasVoted(uid, login) {
        if (dbType.toLocaleLowerCase() === 'mongodb') {
        }
        
        if (dbType.toLocaleLowerCase() === 'mysql') {
        }
    }

}