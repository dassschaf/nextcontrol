import { NextControl } from '../../nextcontrol.js';
import { Settings } from '../../settings.js';

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
    DbPlayers(nc) {
        // save main object reference
        this.nc = nc;
    }

    async getPlayerInfo(login) {

    }

}