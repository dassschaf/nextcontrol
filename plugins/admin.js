
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
     * Local reference to the main instance
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nextcontrol The script's brain we require to properly register the chat commands
     */
    constructor(nextcontrol) {
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('rescantrack', this.admin_rescantrack, 'rescans track, to add it to the database', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('restart', this.admin_restart, 'Restarts the current track immediately', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('skip', this.admin_skip, 'Skips the current track immediately', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('add', this.admin_add, 'Add new tracks to the server from TMX, URL or local path', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('shutdown', this.admin_shutdown, 'Shuts down Nextcontrol', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('test', this.testcommand, 'test', this.name));

        this.nextcontrol = nextcontrol;
    }

    /**
     * Rescans the track, to add and update it to the database
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     */
    async admin_rescantrack(login, params) {
        let map = this.nextcontrol.status.map;

        map.tmxid = await TMX.getID(map.uid);

        await this.nextcontrol.database.collection('maps').updateOne({uid: map.uid}, {$set: map}, {upsert: true});
    }

    /**
     * Test command... what'd you expect?
     * @param {String} login 
     * @param {Array<String>} params 
     */
    async testcommand(login, params) {
        let map = this.nextcontrol.status.map;

        console.log('Current track: ' + stripFormatting(map.name));
    }

    /**
     * Function making the current track being restarted
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     */
    async admin_restart(login, params) {
        // get title and player name
        let name = this.nextcontrol.status.getPlayer(login).name;

        await this.nextcontrol.client.query('RestartMap');
        await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.restart, {name: name})]);
    }

    /**
     * Function making the current track being skipped
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     */
    async admin_skip(login, params) {
        // get title and player name
        let name = this.nextcontrol.status.getPlayer(login).name;

        await this.nextcontrol.client.query('NextMap');
        await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.skip, {name: name})]);
    }

    /**
     * Function making the current track being restarted
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     */
    async admin_shutdown(login, params) {
        // get title and player name
        let name = this.nextcontrol.status.getPlayer(login).name;

        await this.nextcontrol.client.query('ChatSendServerMessage', [`$z$s$ff0~~ $fffShutting down...`]);

        process.exit();
    }

    /**
     * Function handling adding tracks to the server
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     */
    async admin_add(login, params) {
        // get title and player name
        let player = this.nextcontrol.status.getPlayer(login);

        // parameter order:
        // 1: source: tmx, local, url
        // 2: link or path or id
        //      -> link if URL
        //      -> path, relative to /Maps/ if local
        //      -> id if TMX

        let source = params.shift(),
            link = params.shift();

        if (source.toLocaleLowerCase() == 'tmx') {
            
            if (isNaN(link) || isNaN(parseFloat(link))) {
                this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addTmxFailedInvalidID, player.login]);
                return;
            }

            // save ID
            let id = Number(link);

            // get paths right
            let directory = this.nextcontrol.status.directories.maps + '/TMX/',
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
            let map = new Classes.Map(await this.nextcontrol.client.query('GetMapInfo', [directory + filename]));
            map.setTMXId(id);

            logger('r', 'Downloaded track ' + stripFormatting(map.name) + ' from TMX');

            // add track to the map list
            await this.nextcontrol.client.query('InsertMap', [directory + filename]);
            await this.nextcontrol.client.query('SaveMatchSettings', [nc.status.directories.maps + '/MatchSettings/' + Settings.trackmania.matchsettings_file]);

            // add track to the database
            await this.nextcontrol.database.collection('maps').insertOne(map);

            // send info
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.addedTmx, {name: player.name, track: map.name})]);
            logger('r', `${stripFormatting(map.name)} was downloaded from TMX (ID: ${id}) and added to the map list.`);
        }

        if (source.toLocaleLowerCase() == 'local') {
            let directory = this.nextcontrol.status.directories.maps,
                fullPath = directory + link;

            // check if file exists in the first place
            if (!fs.existsSync(fullPath)) {
                this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addLocalFailedInvalidPth, login]);   
                return;
            }

            let map = new Classes.Map(await this.nextcontrol.client.query('GetMapInfo', [fullPath]));
            map.setTMXId(await TMX.getID(map.uid));

            // add track to the map list
            await this.nextcontrol.client.query('InsertMap', [fullPath]);
            await this.nextcontrol.client.query('SaveMatchSettings', [nc.status.directories.maps + '/MatchSettings/' + Settings.trackmania.matchsettings_file]);

            // add track to the database
            await this.nextcontrol.database.collection('maps').insertOne(map);

            // send info
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.addedLocal, {name: player.name, track: map.name})]);
            logger('r', `Local track ${stripFormatting(map.name)} (${link}) was added to the map list.`);
        }

        if (source.toLocaleLowerCase() == 'url') {

            let directory = this.nextcontrol.status.directories.maps + '/URL/',
                filename = link.split('/').pop();

            // fix file name ending
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
            let map = new Classes.Map(await this.nextcontrol.client.query('GetMapInfo', [directory + filename]));
            map.setTMXId(await TMX.getID(map.uid));

            // add track to the map list
            await this.nextcontrol.client.query('InsertMap', [directory + filename]);
            await this.nextcontrol.client.query('SaveMatchSettings', [nc.status.directories.maps + '/MatchSettings/' + Settings.trackmania.matchsettings_file]);

            // add track to the database
            await this.nextcontrol.database.collection('maps').insertOne(map);

            // send info
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.addedUrl, {name: player.name, track: map.name})]);
            logger('r', `${stripFormatting(map.name)} was downloaded from URL (${link}) and added to the map list.`);

        }
    }

}