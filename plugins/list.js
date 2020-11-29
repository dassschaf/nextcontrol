import { Sentences } from '../lib/sentences.js';
import * as util from '../lib/utilities.js';
import * as Classes from '../lib/classes.js';
import { NextControl } from '../nextcontrol.js';

/**
 * Constants for communication about the used lists;
 */
const cmaps = 'MAPS_L', cplayer = 'PLAYERS_L';

/**
 * Number of items per printed list page
 */
const ITEMS = 15;

export class ListsPlugin {

    /**
     * Plugin name
     */
    name = 'Lists';

    /**
     * Plugin authors
     */
    author = 'dassschaf';

    /**
     * Plugin description
     */
    description = 'Allows players to query something and save a list for later command use';

    /**
     * 
     * @param {NextControl} nc 
     */
    constructor(nc) {
        nc.registerChatCommand(new Classes.ChatCommand('list', this.listCommand, 'List something for later use!', this.name));
    }

    /**
     * Handles incoming list commands 
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {NextControl} nc 
     */
    async listCommand(login, params, nc) {
        // get list category
        let task = params.shift();

        if (task === 'maps' || task === 'map') {
            await this.maps(login, params, nc);
            await this.show(login, ['maps', 1], nc);
        } else if (task === 'players' || task === 'player') {
            await this.players(login, params, nc);
            await this.show(login, ['players', 1], nc);
        } else if (task === 'show') {
            await this.show(login, params, nc);
        }
    }

    /**
     * Queries the database for maps after a search query or returns a full list
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {NextControl} nc 
     */
    async maps(login, params, nc) {
        if (params.length == 0) {
            /**
             * @type {Array<Classes.Map>}
             */
            let maps = await nc.database.collection('maps').find().toArray();

            // write maps array to the player's list:
            nc.lists.maps.set(login, maps);
            return;
        }
    }

    /**
     * Queries the server for the current player list
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {NextControl} nc 
     */
    async players(login, params, nc) {
        if (params.length == 1 && params[0] == 'online' || params.length == 0) {
            let players = await nc.client.query('GetPlayerList', [1000, 0, 1]);
            
            players.forEach((player, i) => {players[i] = new Classes.PlayerInfo(player)});

            nc.lists.players.set(login, players);
            return;
        } else if (params.length == 1 && ['db', 'database'].includes(params[0])) {
            let players = await nc.database.collection('players').find().toArray();

            nc.lists.players.set(login, players)
        }
    }

    /**
     * Queries the database for maps after a search query or returns a full list
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {NextControl} nc 
     */
    async show(login, params, nc) {
        // abort for invalid parameters
        if (params.length < 2 || !(['maps', 'players'].includes(params[0]))) { nc.client.query('ChatSendServerMessageToLogin', [Sentences.lists.showInvalidParams, login]); return; }

        let mode = params[0],
            page = (params[1] != undefined) ? params[1] : 1;

        if (mode == 'maps') {
            if (!nc.lists.maps.has(login)) { await this.maps(login, [], nc); }
            this.toChat(login, cmaps, page, nc);

        } else if (mode == 'players') {
            if (!nc.lists.players.has(login)) await this.players(login, [], nc);
            this.toChat(login, cplayer, page, nc);
        }
    }

    /**
     * Prints a given list to a player
     * @param {String} login Player login
     * @param {String} list List to be shown
     * @param {Number} pageNr Page # to be shown
     * @param {NextControl} nc
     */
    async toChat(login, list, pageNr, nc) {
        
        if (list === cmaps) {
            // print maps list for player $login

            let items = nc.lists.maps.get(login),
                lowerBound = (pageNr - 1) * ITEMS,
                upperBound = pageNr * ITEMS,
                message = util.format(Sentences.lists.header, {type: 'Maps', pg: pageNr, pages: Math.ceil(items.length / ITEMS)});

            items = items.slice(lowerBound, upperBound);

            items.forEach((item, i) => message += '\n' + util.format(Sentences.lists.mapItem, {id: i, name: item.name, author: item.author}));

            await nc.client.query('ChatSendServerMessageToLogin', [message, login]);
        }

        if (list === cplayer) {
            // print players list for player $login

            let items = nc.lists.players.get(login),
                lowerBound = (pageNr - 1) * ITEMS,
                upperBound = pageNr * ITEMS,
                message = util.format(Sentences.lists.header, {type: 'Players', pg: pageNr, pages: Math.ceil(items.length / ITEMS)});

            items = items.slice(lowerBound, upperBound);

            items.forEach((item, i) => message += '\n' + util.format(Sentences.lists.playerItem, {id: i, name: item.name, login: item.login}));

            await nc.client.query('ChatSendServerMessageToLogin', [message, login]);
        }
    }
}