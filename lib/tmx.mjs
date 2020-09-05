import got from 'got';
import { Settings } from '../settings.mjs';
import fs from 'fs';

/**
 * TMX API wrapper class
 */
export class TMX {

    /**
     * Constructs an object of the TMX API wrapper
     * @param mapsDir Maps Directory path as returned from server
     */

    static headers = {
        'X-ManiaPlanet-ServerLogin': Settings.trackmania.server_login
    };

    static site = (Settings.trackmania.game === 'TM2020') ? 'https://trackmania.exchange' : 'https://tm.mania.exchange';

    constructor(mapsDir)
    {
        this.mapsDir = mapsDir;
        this.site = 

        this.headers = {};
        this.headers['X-ManiaPlanet-ServerLogin'] = Settings.trackmania.server_login;
    }

    /**
     * Downloads a track from TMX and returns the download path relative to the Maps directory
     * @param id track's TMX ID
     * @returns {String} relative path from Maps directory to add the track to the maplist with
     */
    async downloadtrack(id) {
        const response = await got({url: site + '/maps/download/' + id, encoding: 'binary', headers: this.headers});
        const body = response.body;

        let absolutePath = this.mapsDir + '/TMX/' + id + '.Map.Gbx',
            relativePath = '/TMX/' + id + '.Map.Gbx',
            targetDirectory = this.mapsDir + '/TMX/';

        // check if the target directory we save tracks to exists
        if (!fs.existsSync(targetDirectory)) fs.mkdirSync(targetDirectory);

        fs.writeFileSync(absolutePath, body, 'binary');

        return relativePath;
    }
}
