
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
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('test', this.testcommand, 'Test command', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('remove', this.admin_remove, 'Removes a selected track', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('extend', this.admin_extend, 'Extends the play time by a given value (default: 300s).', this.name));

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
     * Function extending the currently played track's time
     * @param {String} login login of the calling player
     * @param {Array<String>} params parameters of the call
     */
    async admin_extend(login, params) {
        // get title and player name
        let name = this.nextcontrol.status.getPlayer(login).name,
            time = 300;

        if (!this.nextcontrol.modeSettings.isTimeExtendable()) {
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.cannotExtend, login]);
            return;
        }

        // override default time, if time is given
        if (typeof params[0] !== 'undefined') {
            if (isNaN(Number(params[0]))) {
                // abort:
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.invalidParams]);
                return;
            }

            time = Number(params[0]);
        }

        if (!await this.nextcontrol.modeSettings.extendTime(time)) {
            // error!
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.extendError, login]);

        } else {
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.extended, {name: this.nextcontrol.status.getPlayer(login).name, time: time})]);
            logger('r', 'Successfully extended time by ' + time + ' seconds.')
        }
    }

    /**
     * Function removing a selected track from the database and map rotation
     * @param {String} login 
     * @param {Array<String>} params 
     */
    async admin_remove(login, params) {
        // check player's list first
        if (!(this.nextcontrol.lists.maps.has(login) && this.nextcontrol.lists.maps.get(login).length > 0)) {
            // abort:
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [format(Sentences.admin.requiresList, {type: 'Maps'})]);
            return;
        }

        let id = Number(params[0])

        if (isNaN(id)) {
            // abort:
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.invalidParams]);
            return;
        }

        let map = this.nextcontrol.lists.maps.get(login)[id];

        // remove database entry
        await this.nextcontrol.database.collection('maps').deleteOne(map);

        // remove map from map rotation
        await this.nextcontrol.client.query('RemoveMap', [map.file])

        // save match settings
        await this.nextcontrol.client.query('SaveMatchSettings', [this.nextcontrol.status.directories.maps + '/MatchSettings/' + Settings.trackmania.matchsettings_file]);

        // send message
        await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.removed, {name: this.nextcontrol.status.getPlayer(login).name, map: map.name})]);
    }

    /**
     *
     * @param {String} login
     * @param {Array<String>} params
     * @returns {Promise<void>}
     */
    async admin_mode(login, params) {
        if (params.length == 0) {
            // not enough parameters
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.invalidParams, login]);
            return;
        }

        let operation = params.shift();

        if (operation === 'save') {
            // save to match settings
            await this.nextcontrol.modeSettings.saveSettingsToFile();
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.settingsSaved, login]);

        } else if (operation === 'keep') {
            // keep this until script/server restart
            this.nextcontrol.modeSettings.keepTempSettings();
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.settingsKept, login]);

        } else if (operation === 'reset') {
            // reset to current default settings
            await this.nextcontrol.modeSettings.resetSettings();
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.settingsReset, login]);

        } else if (operation === 'read') {
            // read match settings
            await this.nextcontrol.modeSettings.readMatchSettings();
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.settingsRead, login]);

        } /* else if (operation === 'set') {
            // currently broken, will fix later.

            // set a mode setting to a value
            if (params.length === 2) {
                let setting = params.shift(),
                    value = params.shift().toString();

                // adjust type of value
                if (!isNaN(Number(value))) value = Number(value);
                if (value.toLocaleLowerCase() === 'true' || value.toLocaleLowerCase() === 'false') value = Boolean(value);
                // else: keep string

                let struct = {};
                    struct[setting] = value;

                await this.nextcontrol.client.query('SetModeScriptSettings', struct);

            } else {
                // not enough parameters
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.invalidParams, login]);
            }
        } */
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
     * Shuts down the script.
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     */
    async admin_shutdown(login, params) {
        // get title and player name
        await this.nextcontrol.client.query('ChatSendServerMessage', [`$z$s$ff0~~ $fffShutting down...`]);
        logger('w', 'Shutting down NextControl upon /admin shutdown!')

        process.exit(0);
    }

    /**
     * Function handling adding tracks to the server
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     */
    async admin_add(login, params) {
        // get title and player name
        let player = this.nextcontrol.status.getPlayer(login);

        if (params.length !== 2) {
            // not enough parameters
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.invalidParams, login]);
            return;
        }

        // parameter order:
        // 1: source: tmx, local, url
        // 2: link or path or id
        //      -> link if URL
        //      -> path, relative to /Maps/ if local
        //      -> id if TMX

        let source = params.shift(),
            link = params.shift();

        if (source.toLocaleLowerCase() === 'tmx') {
            
            if (isNaN(Number(link)) || isNaN(parseFloat(link))) {
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addTmxFailedInvalidID, player.login]);
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
            await this.addTrackToServer(directory + filename, map)

            // send info
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.addedTmx, {name: player.name, track: map.name})]);
            logger('r', `${stripFormatting(map.name)} was downloaded from TMX (ID: ${id}) and added to the map list.`);
        }

        if (source.toLocaleLowerCase() === 'local') {
            let directory = this.nextcontrol.status.directories.maps,
                fullPath = directory + link;

            // check if file exists in the first place
            if (!fs.existsSync(fullPath)) {
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addLocalFailedInvalidPth, login]);
                return;
            }

            let map = new Classes.Map(await this.nextcontrol.client.query('GetMapInfo', [fullPath]));
            map.setTMXId(await TMX.getID(map.uid));

            // add track to the map list
            // add track to the map list
            await this.addTrackToServer(fullPath, map)

            // send info
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.addedLocal, {name: player.name, track: map.name})]);
            logger('r', `Local track ${stripFormatting(map.name)} (${link}) was added to the map list.`);
        }

        if (source.toLocaleLowerCase() === 'url') {

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
            await this.addTrackToServer(directory + filename, map)

            // send info
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.addedUrl, {
                name: player.name,
                track: map.name
            })]);
            logger('r', `${stripFormatting(map.name)} was downloaded from URL (${link}) and added to the map list.`);

        }
    }

    /**
     * Adds a track to the server
     * @param path {String} absolute! path to the track
     * @param map {Classes.Map} map object
     * @returns {Promise<void>}
     */
    async addTrackToServer(path, map) {
        // add track
        await this.nextcontrol.client.query('InsertMap', [path]);

        // save map settings
        await this.nextcontrol.client.query('SaveMatchSettings', [this.nextcontrol.status.directories.maps + '/MatchSettings/' + Settings.trackmania.matchsettings_file]);

        // add track to the database
        await this.nextcontrol.database.collection('maps').insertOne(map);
    }

}