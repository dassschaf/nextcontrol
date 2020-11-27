import got from 'got';
import { Settings } from '../settings.js';
import fs from 'fs';

/**
 * TMX API wrapper class
 */
export class TMX {

    /**
     * The headers sent to TMX
     */
    static headers = {
        'X-ManiaPlanet-ServerLogin': Settings.trackmania.server_login
    };

    /**
     * The site we interact with, TMX for TM2020, TM.MX for TM2
     */
    static site = (Settings.trackmania.game === 'TM2020') ? 'https://trackmania.exchange' : 'https://tm.mania.exchange';

    /**
     * Downloads a track from TMX and returns the download path relative to the Maps directory
     * @param {number} id track's TMX ID
     * @returns {string} relative path from Maps directory to add the track to the maplist with
     */
    static async download(id, downloadDir) {
        const response = await got({url: this.site + '/maps/download/' + id, encoding: 'binary', headers: this.headers});
        const body = response.body;

        // check if the target directory we save tracks to exists
        if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

        fs.writeFileSync(downloadDir + id + '.Map.Gbx', body, 'binary');

        return downloadDir + id + '.Map.Gbx';
    }

    /**
     * Returns the TMX ID of a map, based off the map's UID
     * @param {string} uid map uid
     */
    static async getID(uid) {
        // API call URL
        let url = this.site + '/api/maps/get_map_info/multi/';

        // append UID to api call
        url += uid;

        const response = await got(url, {responseType: 'json', headers: this.headers});

        if (response.body.length > 0)
            return response.body[0].TrackID;

        else return -1;
    }
}
