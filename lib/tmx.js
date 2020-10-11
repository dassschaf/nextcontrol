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
        'X-ManiaPlanet-ServerLogin': Settings.trackmania.server_login,
        'User-Agent': 'NextControl/dev'
    };

    /**
     * The site we interact with, TMX for TM2020, TM.MX for TM2
     */
    static site = (Settings.trackmania.game === 'TM2020') ? 'https://trackmania.exchange' : 'https://tm.mania.exchange';

    /**
     * Downloads a track from TMX and returns the download path relative to the Maps directory
     * @param id track's TMX ID
     * @returns {string} relative path from Maps directory to add the track to the maplist with
     */
    static async download(id, downloadDir) {
        const response = await got({url: this.site + '/maps/download/' + id, encoding: 'binary', headers: this.headers});
        const body = response.body;

        let absolutePath = downloadDir + '/TMX/' + id + '.Map.Gbx',
            relativePath = '/TMX/' + id + '.Map.Gbx',
            targetDirectory = downloadDir + '/TMX/';

        // check if the target directory we save tracks to exists
        if (!fs.existsSync(targetDirectory)) fs.mkdirSync(targetDirectory);

        fs.writeFileSync(absolutePath, body, 'binary');

        return relativePath;
    }

    /**
     * Returns the TMX ID of a map, based off the map's UID
     * @param {string | Array<string>} uid map uid
     */
    static async getID(uid) {
        
        let url = this.site + '/maps/get_map_info/multi/';

        if (Array.isArray(uid)) {
            while (uid.length > 1) {
                url += uid.shift() + ','
            }
            url += uid.shift();
        }
        else
            url += uid;

    }
}
