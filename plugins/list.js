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
        } else if (task === 'players' || task === 'player') {

        } else if (task === 'show') {

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

            // write the list to chat
            await this.toChat(login, cmaps, 1, nc);
        }
    }

    /**
     * Queries the database for maps after a search query or returns a full list
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {NextControl} nc 
     */
    async players(login, params, nc) {
        return;
    }

    /**
     * Queries the database for maps after a search query or returns a full list
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {NextControl} nc 
     */
    async show(login, params, nc) {
        return;
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

        }
    }
}