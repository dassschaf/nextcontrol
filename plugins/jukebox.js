import { NextControl } from '../nextcontrol.js'
import { MatchResults } from '../lib/callbackparams.js';
import * as Classes from '../lib/classes.js';

export class JukeboxPlugin {
    name = 'Jukebox'
    author = 'dassschaf'
    description = 'Adds jukebox functionality.'

    /**
     * 
     * @param {NextControl} nc 
     */
    constructor(nc) {
        nc.registerChatCommand(new Classes.ChatCommand('jukebox', this.jukeboxCommand, 'Jukeboxes a map.', this.name));
    }

    /**
     * 
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {Nextcontrol} nc 
     */
    async jukeboxCommand(login, params, nc) {

    }

    /**
     * Function run on match end to check for Jukebox things
     * @param {MatchResults} results 
     * @param {NextControl} nc 
     */
    async onEndMatch(results, nc) {
        // jukebox stuff
        if (!nc.jukebox.isEmpty()) {

            let entry = nc.jukebox.unqueueMap(),
                abort = false;

            while (!nc.status.playerOnline(entry.player.login) && !abort) {
                // skip jukebox submission:
                await nc.client.query('ChatSendServerMessage', [format(Sentences.jukebox.leftSkipWish, {name: entry.player.name, map: entry.map.name})]);
                logger('r', `Jukebox: Skipping queue entry for map ${stripFormatting(entry.map.name)} as requested by ${entry.player.name} because player left.`);
        
                if (!nc.jukebox.isEmpty())
                    entry = nc.jukebox.unqueueMap();

                else
                    abort = true;
            }
            
            if (!abort) {
                await nc.client.query('SetNextMapIdent', [entry.map.uid]);
                await nc.client.query('ChatSendServerMessage', [format(Sentences.jukebox.nextMapIs, {name: entry.player.name, map: entry.map.name})]);

                logger('r', `Jukebox: Set next map to ${stripFormatting(entry.map.name)} as requested by ${entry.player.name}`);
            }
        }
    }
}