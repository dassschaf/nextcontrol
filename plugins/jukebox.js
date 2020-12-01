import { NextControl } from '../nextcontrol.js'
import { MatchResults } from '../lib/callbackparams.js';
import { Sentences } from '../lib/sentences.js';
import * as Classes from '../lib/classes.js';
import { logger, stripFormatting, isNum } from '../lib/utilities.js';

export class JukeboxPlugin {
    name = 'Jukebox'
    author = 'dassschaf'
    description = 'Adds jukebox functionality.'

    /**
     * 
     * @param {NextControl} nc 
     */
    constructor(nc) {
        cooldown = new Map();

        nc.registerChatCommand(new Classes.ChatCommand('jukebox', this.jukeboxCommand, 'Jukeboxes a map.', this.name));
    }

    /**
     * 
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {NextControl} nc 
     */
    async jukeboxCommand(login, params, nc) {
        if (params.length != 1) {
            await nc.client.query('ChatSendServerMessageToLogin', [Sentences.jukebox.requiresId, login]);
            return;
        }

        // check if map query list is empty:
        if (nc.lists.maps.has(login) && nc.lists.maps.get(login).length > 0) {

            // check if valid number
            if (isNum(params[0])) {
                await nc.client.query('ChatSendServerMessageToLogin', [Sentences.jukebox.invalidNumber, login]);
                return;
            }

            let id = Number(params[0]);

            // check if valid index
            if (nc.lists.maps.get(login).length > id - 1) {
                await nc.client.query('ChatSendServerMessageToLogin', [Sentences.jukebox.invalidIndex, login]);
                return;
            }
            
            let map = nc.lists.maps.get(login)[id],
                player = nc.status.getPlayer(login);

            nc.jukebox.queueMap(map, player);
            logger('r', `Jukebox: ${stripFormatting(player.name)} has successfully jukeboxed track ${stripFormatting(map.name)}.`);

        } else {
            // tell the user to first query for maps
            await nc.client.query('ChatSendServerMessageToLogin', [Sentences.jukebox.requiresList, login]);
            return;
        }
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