
import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { Settings } from '../settings.js'

import * as Classes from '../lib/classes.js'
import { NextControl } from '../nextcontrol.js'
import { TMX } from '../lib/tmx.js'

import * as fs from 'fs';
import got from 'got';

/**
 * Plugin containing the most necessary administration commands and features
 */
export class AdminSuite {

    /**
     * Plugin name
     */
    name           = 'Admin suite'

    /**
     * Plugin author
     */
    author         = 'dassschaf'

    /**
     * Plugin description
     */
    description    = 'Plugin containing the most necessary administration commands and features'

    /**
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nc The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) {
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('rescantrack', this.admin_rescantrack, 'rescans track, to add it to the database', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('restart', this.admin_restart, 'Restarts the current track immediately', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('add', this.admin_add, 'Add new tracks to the server from TMX, URL or local path', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('shutdown', this.admin_shutdown, 'Shuts down Nextcontrol', this.name));
    }

    /**
     * Rescans the track, to add and update it to the database
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     * @param {NextControl} nc 
     */
    async admin_rescantrack(login, params, nc) {
        let map = nc.status.map;

        map.tmxid = await TMX.getID(map.uid);

        await nc.database.collection('maps').updateOne({uid: map.uid}, {$set: map}, {upsert: true});
    }

    /**
     * Function making the current track being restarted
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     * @param {NextControl} nc 
     */
    async admin_restart(login, params, nc) {
        // get title and player name
        let name = nc.status.getPlayer(login).name;

        nc.client.query('RestartMap').then(res => {
            nc.clientWrapper.chatSendServerMessage(format(Sentences.admin.restart, {name: name}));
        });

    }

    /**
     * Function making the current track being restarted
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     * @param {NextControl} nc 
     */
    async admin_shutdown(login, params, nc) {
        // get title and player name
        let name = nc.status.getPlayer(login).name;

        await nc.client.query('ChatSendServerMessage', [`$z$s$ff0~~ $fffShutting down...`]);

        process.exit();
    }

    /**
     * Function handling adding tracks to the server
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     * @param {NextControl} nc 
     */
    async admin_add(login, params, nc) {
        // get title and player name
        let player = nc.status.getPlayer(login);

        // parameter order:
        // 1: source: tmx, local, url
        // 2: link or path or id
        //      -> link if URL
        //      -> path, relative to /Maps/ if local
        //      -> id if TMX

        let source = params.shift(),
            link = params.shift();

        if (source.toLocaleLowerCase() == 'tmx') {
            
            // save ID
            let id = Number(link);

            if (id == NaN) {
                nc.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addTmxFailedInvalidID, player.login]);

                return;
            }

            // get paths right
            let directory = nc.status.directories.maps + '/TMX/',
                filename = id + '.Map.Gbx';

            // ensure the directory we save to exists
            if (!fs.existsSync(directory)) fs.mkdirSync(directory);

            // get url right
            const url = TMX.site + '/maps/download/' + id;

            // download track
            const request = await got(url, {headers: TMX.headers, encoding: 'binary'});
            const trackFile = request.rawBody;

            // write track to the TMX folder
            fs.writeFileSync(directory + filename, trackFile);

            // get track info
            let map = new Classes.Map(await nc.client.query('GetMapInfo', [directory + filename]));
            map.setTMXId(id);

            logger('r', 'Downloaded track ' + stripFormatting(map.name) + ' from TMX');

            // add track to the map list
            await nc.client.query('InsertMap', [directory + filename]);
            await nc.client.query('SaveMatchSettings', [nc.status.directories.maps + '/MatchSettings/' + Settings.trackmania.matchsettings_file]);

            // add track to the database
            await nc.database.collection('maps').insertOne(map);

            // send info
            await nc.client.query('ChatSendServerMessage', [format(Sentences.admin.addedTmx, {name: player.name, track: map.name})]);
            logger('r', `${stripFormatting(map.name)} was downloaded from TMX (ID: ${id}) and added to the map list.`);
        }

        if (source.toLocaleLowerCase() == 'local') {
            
        }

        if (source.toLocaleLowerCase() == 'url') {

            let directory = nc.status.directories.maps + '/URL/',
                filename = link.split('/').pop();

            if (!filename.endsWith('.Map.Gbx'))
                filename += '.Map.Gbx';

            // ensure the directory we save to exists
            if (!fs.existsSync(directory)) fs.mkdirSync(directory);

            // download track
            const request = await got(link, {headers: TMX.headers, encoding: 'binary'});
            const trackFile = request.rawBody;

            // write track to the TMX folder
            fs.writeFileSync(directory + filename, trackFile);

            // get track info
            let map = new Classes.Map(await nc.client.query('GetMapInfo', [directory + filename]));
            map.setTMXId(TMX.getID(map.uid));

            // add track to the map list
            await nc.client.query('InsertMap', [directory + filename]);
            await nc.client.query('SaveMatchSettings', [nc.status.directories.maps + '/MatchSettings/' + Settings.trackmania.matchsettings_file]);

            // add track to the database
            await nc.database.collection('maps').insertOne(map);

            // send info
            await nc.client.query('ChatSendServerMessage', [format(Sentences.admin.addedUrl, {name: player.name, track: map.name})]);
            logger('r', `${stripFormatting(map.name)} was downloaded from URL (${link}) and added to the map list.`);

        }
    }

}