import { Sentences } from '../lib/sentences.mjs';
import { logger, format, stripFormatting } from '../lib/utilities.mjs';
import { Settings } from '../settings.mjs';

/**
 * Join and leave message plugin
 */
export class Join {
    constructor(conns) {
        // plugin name:
        this.name           = 'Join and Leave'
        this.author         = 'dassschaf'
        this.description    = 'Join and leave message plugin'

        this.client = conns.client;
        this.database = conns.database;

        this.players = {};
    }

    async onPlayerConnect(params) {
        
        let playerInfo = await this.client.getPlayerInfo(params.login);
        
        //logger(JSON.stringify(playerInfo));

        this.players[params.login] = playerInfo;

        logger('r', stripFormatting(playerInfo.name) + ' has joined the server');
        this.client.chatSendServerMessage(Sentences.playerConnect, [playerInfo.name]);
    }

    async onPlayerDisconnect(params) {
        let playerInfo = this.players[params.login];

        logger('r', stripFormatting(playerInfo.name) + ' has left the server');
        this.client.chatSendServerMessage(Sentences.playerDisconnect, [playerInfo.name]);
    }
}