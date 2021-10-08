import { NextControl } from "../../nextcontrol.js";

import {Settings} from '../../settings.js';
const dbType = Settings.usedDatabase;

export class DbRecords {

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

}