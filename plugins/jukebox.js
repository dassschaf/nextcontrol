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
     * Local reference to the main instance
     * @type {NextControl}
     */
    nextcontrol

    /**
     * 
     * @param {NextControl} nc 
     */
    constructor(nc) {
        nc.registerChatCommand(new Classes.ChatCommand('jukebox', this.jukeboxCommand, 'Jukeboxes a map.', this.name));

        // save reference
        this.nextcontrol = nc;
    }

    /**
     * Jukeboxing command
     * @param {String} login 
     * @param {Array<String>} params 
     */
    async jukeboxCommand(login, params) {
        if (params.length != 1) {
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.jukebox.requiresId, login]);
            return;
        }

        // check if map query list is empty:
        if (this.nextcontrol.lists.maps.has(login) && this.nextcontrol.lists.maps.get(login).length > 0) {

            // check if valid number
            if (isNum(params[0])) {
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.jukebox.invalidNumber, login]);
                return;
            }

            let id = Number(params[0]);

            // check if valid index
            if (this.nextcontrol.lists.maps.get(login).length > id - 1) {
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.jukebox.invalidIndex, login]);
                return;
            }
            
            let map = this.nextcontrol.lists.maps.get(login)[id],
                player = this.nextcontrol.status.getPlayer(login);

            this.nextcontrol.jukebox.queueMap(map, player);
            logger('r', `Jukebox: ${stripFormatting(player.name)} has successfully jukeboxed track ${stripFormatting(map.name)}.`);

        } else {
            // tell the user to first query for maps
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.jukebox.requiresList, login]);
            return;
        }
    }

    /**
     * Function run on match end to check for Jukebox things
     * @param {MatchResults} results 
     */
    async onEndMatch(results) {
        // jukebox stuff
        if (!this.nextcontrol.jukebox.isEmpty()) {

            let entry = this.nextcontrol.jukebox.unqueueMap(),
                abort = false;

            while (!this.nextcontrol.status.playerOnline(entry.player.login) && !abort) {
                // skip jukebox submission:
                await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.jukebox.leftSkipWish, {name: entry.player.name, map: entry.map.name})]);
                logger('r', `Jukebox: Skipping queue entry for map ${stripFormatting(entry.map.name)} as requested by ${entry.player.name} because player left.`);
        
                if (!this.nextcontrol.jukebox.isEmpty())
                    entry = this.nextcontrol.jukebox.unqueueMap();

                else
                    abort = true;
            }
            
            if (!abort) {
                await this.nextcontrol.client.query('SetNextMapIdent', [entry.map.uid]);
                await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.jukebox.nextMapIs, {name: entry.player.name, map: entry.map.name})]);

                logger('r', `Jukebox: Set next map to ${stripFormatting(entry.map.name)} as requested by ${entry.player.name}`);
            }
        }
    }
}