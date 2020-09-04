import got from 'got';
import { Settings } from '../settings.mjs';

class TMX {

    static downloadtrack(id, path) {
        let site;

        // define correct site for game
        if (Settings.trackmania.game === 'TM2020')
            site = 'https://trackmania.exchange';

        else
            site = 'tm.mania.exchange';

        

    }
}

// export statement
export { TMX };