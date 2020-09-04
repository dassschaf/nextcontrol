import got from 'got';
import { Settings } from '../settings.mjs';

/**
 * TMX API wrapper class
 */
export class TMX {

    /**
     * Constructs an object of the TMX API wrapper
     * @param mapsDir Maps Directory path as returned from server
     */
    constructor(mapsDir)
    {
        this.mapsDir = mapsDir;
        this.site = (Settings.trackmania.game === 'TM2020') ? 'https://trackmania.exchange' : 'https://tm.mania.exchange';
    }

    async downloadtrack(id) {

        const response = await got({url: site + '/maps/download/' + id, encoding: 'binary'});



    }
}
