import { Sentences } from '../lib/sentences.js';
import * as util from '../lib/utilities.js';
import * as Classes from '../lib/classes.js';
import { NextControl } from '../nextcontrol.js';

/**
 * Constants for communication about the used lists;
 */
const MAPS_L = 'MAPS_L', PLAYERS_L = 'PLAYERS_L';

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

        switch(task) {
            case 'maps':
            case 'map':
                await this.list_maps(login, params, nc);
                break;

            case 'players':
            case 'player':
                //todo
                break;

            case 'show':
                //todo
                break;
        }

    }

    /**
     * Queries the database for maps after a search query or returns a full list
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {NextControl} nc 
     */
    async list_maps(login, params, nc) {

        if (params.length == 0) {
            /**
             * @type {Array<Classes.Map>}
             */
            let maps = await nc.database.collection('maps').find().toArray();

            // write maps array to the player's list:
            nc.lists.maps.set(login, maps);

            // write the list to chat
            await this.printList(login, MAPS_L, 1, nc);
        }

    }

    /**
     * Queries the database for maps after a search query or returns a full list
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {NextControl} nc 
     */
    async list_players(login, params, nc) {

    }

    /**
     * Queries the database for maps after a search query or returns a full list
     * @param {String} login 
     * @param {Array<String>} params 
     * @param {NextControl} nc 
     */
    async list_show(login, params, nc) {

    }

    /**
     * Prints a given list to a player
     * @param {String} login Player login
     * @param {String} list List to be shown
     * @param {Number} pageNr Page # to be shown
     * @param {NextControl} nc
     */
    async printList(login, list, pageNr, nc) {
        
        if (list === MAPS_L) {
            // print maps list for player $login

            let items = nc.lists.maps.get(login),
                lowerBound = (pageNr - 1) * ITEMS,
                upperBound = pageNr * ITEMS,
                message = util.format(Sentences.lists.header, {type: 'Maps', pg: pageNr, pages: Math.ceil(items.length / ITEMS)});

            items = items.slice(lowerBound, upperBound);

            items.forEach((item, i) => message += '\n' + util.format(Sentences.lists.mapItem, {id: i, name: item.name, author: item.author}));

            await nc.client.query('ChatSendServerMessageToLogin', [message, login]);
        }

        if (list === PLAYERS_L) {
            // print players list for player $login

        }
    }

    
}