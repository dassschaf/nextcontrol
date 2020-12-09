import { Sentences } from '../lib/sentences.js';
import * as util from '../lib/utilities.js';
import * as Classes from '../lib/classes.js';
import { NextControl } from '../nextcontrol.js';
import {stripFormatting} from "../lib/utilities.js";

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
     * Local reference to the main instance
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Constructs the plugin
     * @param {NextControl} nc
     */
    constructor(nc) {
        nc.registerChatCommand(new Classes.ChatCommand('list', this.listCommand, 'List something for later use!', this.name));

        // save reference
        this.nextcontrol = nc;
    }

    /**
     * Handles incoming list commands
     * @param {String} login
     * @param {Array<String>} params
     */
    async listCommand(login, params) {
        // get list category
        let task = params.shift();

        if (task === 'maps' || task === 'map') {
            await this.maps(login, params);
            await this.show(login, ['maps', 1]);
        } else if (task === 'players' || task === 'player') {
            await this.players(login, params);
            await this.show(login, ['players', 1]);
        } else if (task === 'show') {
            await this.show(login, params);
        }
    }

    /**
     * Queries the database for maps after a search query or returns a full list
     * @param {String} login
     * @param {Array<String>} params
     */
    async maps(login, params) {
        if (params.length === 0) {
            /**
             * @type {Array<Classes.Map>}
             */
            let maps = await this.nextcontrol.database.collection('maps').find().toArray();

            // write maps array to the player's list:
            this.nextcontrol.lists.maps.set(login, maps);
            return;
        }

        if (params.length === 1) {
            /**
             * @type {Array<Classes.Map>}
             */
            let hits = [],
                maps = await this.nextcontrol.database.collection('maps').find().toArray();

            // make search regex
            let regex = new RegExp(params[0], 'gi');

            maps.forEach(map => {
                if (regex.test(stripFormatting(map.name)))
                    hits.push(map);
            });

            this.nextcontrol.lists.maps.set(login, hits);
            return;
        }
    }

    /**
     * Queries the server for the current player list
     * @param {String} login
     * @param {Array<String>} params
     */
    async players(login, params) {
        if (params.length == 1 && params[0] == 'online' || params.length == 0) {
            let players = JSON.parse(JSON.stringify(this.nextcontrol.status.players));

            this.nextcontrol.lists.players.set(login, players);
            return;
        } else if (params.length == 1 && ['db', 'database'].includes(params[0])) {
            let players = await this.nextcontrol.database.collection('players').find().toArray();

            this.nextcontrol.lists.players.set(login, players)
        }
    }

    /**
     * Queries the database for maps after a search query or returns a full list
     * @param {String} login
     * @param {Array<String>} params
     */
    async show(login, params) {
        // abort for invalid parameters
        if (params.length < 2 || !(['maps', 'players'].includes(params[0]))) { this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.lists.showInvalidParams, login]); return; }

        let mode = params[0],
            page = (params[1] != undefined) ? params[1] : 1;

        if (mode == 'maps') {
            if (!this.nextcontrol.lists.maps.has(login)) { await this.maps(login, []); }
            this.toChat(login, cmaps, page);

        } else if (mode == 'players') {
            if (!this.nextcontrol.lists.players.has(login)) await this.players(login, []);
            this.toChat(login, cplayer, page);
        }
    }

    /**
     * Prints a given list to a player
     * @param {String} login Player login
     * @param {String} list List to be shown
     * @param {Number} pageNr Page # to be shown
     */
    async toChat(login, list, pageNr) {

        if (list === cmaps) {
            // print maps list for player $login

            let items = this.nextcontrol.lists.maps.get(login),
                lowerBound = (pageNr - 1) * ITEMS,
                upperBound = pageNr * ITEMS,
                message = util.format(Sentences.lists.header, {type: 'Maps', pg: pageNr, pages: Math.ceil(items.length / ITEMS)});

            items = items.slice(lowerBound, upperBound);

            items.forEach((item, i) => message += '\n' + util.format(Sentences.lists.mapItem, {id: i + lowerBound, name: item.name, author: item.author}));

            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [message, login]);
        }

        if (list === cplayer) {
            // print players list for player $login

            let items = this.nextcontrol.lists.players.get(login),
                lowerBound = (pageNr - 1) * ITEMS,
                upperBound = pageNr * ITEMS,
                message = util.format(Sentences.lists.header, {type: 'Players', pg: pageNr, pages: Math.ceil(items.length / ITEMS)});

            items = items.slice(lowerBound, upperBound);

            items.forEach((item, i) => message += '\n' + util.format(Sentences.lists.playerItem, {id: i + lowerBound, name: item.name, login: item.login}));

            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [message, login]);
        }
    }
}