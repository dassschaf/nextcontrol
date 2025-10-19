import { Sentences } from '../lib/sentences.js'
import { format, stripFormatting } from '../lib/utilities.js'
import { Logger } from "../lib/logger.js";
import { Settings } from '../settings.js'
let dbtype = Settings.usedDatabase.toLocaleLowerCase();

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
        // register chat commands:
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('restart', this.admin_restart, 'Restarts the current map immediately', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('skip', this.admin_skip, 'Skips the current map immediately', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('add', this.admin_add, 'Add new maps to the server from TMX, URL or local path', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('shutdown', this.admin_shutdown, 'Shuts down Nextcontrol', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('test', this.testcommand, 'Test command', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('remove', this.admin_remove, 'Removes a selected map', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('extend', this.admin_extend, 'Extends the play time by a given value (default: 300s).', this.name));
        nextcontrol.registerAdminCommand(new Classes.ChatCommand('mode', this.admin_mode, 'Various commands to deal with the matchsettings', this.name));

        // save reference
        this.nextcontrol = nextcontrol;
    }

    /**
     * Test command... what'd you expect?
     * @param {String} login 
     * @param {Array<String>} params 
     */
    async testcommand(login, params) {
        // currently testing: accessing the status
        let map = this.nextcontrol.status.map;

        console.log('Current map: ' + stripFormatting(map.name));
    }

    /**
     * Function making the current map being restarted
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     */
    async admin_restart(login, params) {
        // get title and player name
        let name = this.nextcontrol.status.getPlayer(login).name;

        // restart!
        await this.nextcontrol.client.query('RestartMap');
        await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.restart, {name: name})]);
    }

    /**
     * Function extending the currently played map's time
     * @param {String} login login of the calling player
     * @param {Array<String>} params parameters of the call
     */
    async admin_extend(login, params) {
        // get title and player name
        let name = this.nextcontrol.status.getPlayer(login).name,
            time = 300;

        // check if the gamemode supports extending the time
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

        // if the server returns false we got a problem
        if (!await this.nextcontrol.modeSettings.extendTime(time)) {
            // error!
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.extendError, login]);

        // else, just notify chat and console
        } else {
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.extended, {name: this.nextcontrol.status.getPlayer(login).name, time: time})]);
            Logger.info('Successfully extended time by ' + time + ' seconds.')
        }
    }

    /**
     * Function removing a selected map from the database and map rotation
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

        // check if number is valid
        if (isNaN(id)) {
            // abort:
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.invalidParams]);
            return;
        }

        // get the correct map from the player's list
        let map = this.nextcontrol.lists.maps.get(login)[id];

        // remove map from map rotation
        await this.nextcontrol.client.query('RemoveMap', [map.file])

        // send message
        await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.removed, {name: this.nextcontrol.status.getPlayer(login).name, map: map.name})]);
    }

    /**
     * Match Settings tools command
     * @param {String} login
     * @param {Array<String>} params
     * @returns {Promise<void>}
     */
    async admin_mode(login, params) {
        // check parameters
        if (params.length === 0) {
            // not enough parameters
            await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.invalidParams, login]);
            return;
        }

        // shift operation from array
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

        } else if (operation === 'set') {
            // set a mode setting to a value
            if (params.length === 2) {
                let setting = params.shift(),
                    value = params.shift().toString();

                // add "S_" at the beginning of settings if there isn't one
                if (!setting.startsWith('S_')) setting = "S_" + setting;

                // adjust type of value
                if (value.toLocaleLowerCase() === 'true' || value.toLocaleLowerCase() === 'false') value = Boolean(value);
                else if (!isNaN(Number(value))) value = Number(value);
                // else: keep string

                let struct = {};
                    struct[setting] = value;

                await this.nextcontrol.client.query('SetModeScriptSettings', struct).catch(async err=>{
                    // Report error
                    await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [format(Sentences.errorMessage, {error: err.faultString}), login]);
                });

            } else {
                // not enough parameters
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.invalidParams, login]);
            }
        }
    }

    /**
     * Function making the current map being skipped
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     */
    async admin_skip(login, params) {
        // get title and player name
        let name = this.nextcontrol.status.getPlayer(login).name;

        // skip & notify chat
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
        Logger.warning('Shutting down NextControl upon /admin shutdown!')

        // shut down!
        process.exit(0);
    }

    /**
     * Function handling adding maps to the server
     * @param {String} login login of the calling player 
     * @param {Array<String>} params parameters of the call
     */
    async admin_add(login, params) {
        // get title and player name
        let player = this.nextcontrol.status.getPlayer(login);

        // check parameters
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

        // TMX:
        if (source.toLocaleLowerCase() === 'tmx') {

            // check if the ID is valid
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
            let request;
            // download map
            try {
                request = await got(url, {headers: TMX.headers, encoding: 'binary'});
            } catch (err) {
                Logger.warning(err)
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addTmxFailedInvalidID, player.login]);
                return;
            }

            const mapFile = request.rawBody;

            // write map to the TMX folder
            fs.writeFileSync(directory + filename, mapFile);

            // get map info
            let map = new Classes.Map(await this.nextcontrol.client.query('GetMapInfo', [directory + filename]));
            map.setTMXId(id);

            Logger.info('Downloaded map ' + stripFormatting(map.name) + ' from TMX');

            // add map to the map list
            await this.addmapToServer(directory + filename, map)

            // send info
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.addedTmx, {name: player.name, map: map.name})]);
            Logger.info(`${stripFormatting(map.name)} was downloaded from TMX (ID: ${id}) and added to the map list.`);
        }
        if (source.toLocaleLowerCase() === 'pack') {
            // check if the ID is valid
            if (isNaN(Number(link)) || isNaN(parseFloat(link))) {
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addTmxFailedInvalidID, player.login]);
                return;
            }

            // save ID
            let id = Number(link);

            const mappackUrl = TMX.site + '/api/mappacks?fields=Name&id=' + id;
            // Get mappack name
            let mappackName;
            try {
                const mappackNameResponse = await got(mappackUrl, {headers: TMX.headers}).json();
                mappackName = mappackNameResponse.Results[0].Name;
            } catch (err) {
                Logger.warning(err)
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addTmxFailedInvalidID, player.login]);
                return;
            }
            // make directory
            let directory = this.nextcontrol.status.directories.maps + '/TMX/' + mappackName + '/';
            if (!fs.existsSync(directory)) fs.mkdirSync(directory);

            // Get list of maps in pack
            const mapsUrl = TMX.site + '/api/maps?fields=MapId&mappackid=' + id;

            let maps;
            try {
                maps = await got(mapsUrl, {headers: TMX.headers}).json();
            } catch (err) {
                Logger.warning(err)
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addTmxFailedInvalidID, player.login]);
                return;
            }

            maps.Results.reverse();

            for (const Map of maps.Results) {
                const MapId = Map.MapId;
                let filename = MapId + '.Map.Gbx';
                const url = TMX.site + '/maps/download/' + MapId;
                let request;
                // download map
                try {
                    request = await got(url, {headers: TMX.headers, encoding: 'binary'});
                } catch (err) {
                    Logger.warning(err)
                    await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addTmxFailedInvalidID, player.login]);
                    continue;
                }

                const mapFile = request.rawBody;

                // write map to the TMX folder
                fs.writeFileSync(directory + filename, mapFile);

                // get map info
                let map = new Classes.Map(await this.nextcontrol.client.query('GetMapInfo', [directory + filename]));
                map.setTMXId(MapId);

                Logger.info('Downloaded map ' + stripFormatting(map.name) + ' from TMX');

                // add map to the map list
                try {
                    await this.addmapToServer(directory + filename, map)
                } catch(err){
                    Logger.warning(err)
                    await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [format(Sentences.admin.alreadyAdded, {map: map.name}), player.login]);
                }
            }

            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.addedTmxPack, {name: player.name, mappack: mappackName})]);
            Logger.info(`Pack ${stripFormatting(mappackName)} was downloaded from TMX (ID: ${id}) and added to the map list.`);
        }

        if (source.toLocaleLowerCase() === 'local') {
            let directory = this.nextcontrol.status.directories.maps,
                fullPath = directory + link;

            // check if file exists in the first place
            if (!fs.existsSync(fullPath)) {
                await this.nextcontrol.client.query('ChatSendServerMessageToLogin', [Sentences.admin.addLocalFailedInvalidPth, login]);
                return;
            }

            // get map info
            let map = new Classes.Map(await this.nextcontrol.client.query('GetMapInfo', [fullPath]));
            map.setTMXId(await TMX.getID(map.uid));

            // add map to the map list
            // add map to the map list
            await this.addmapToServer(fullPath, map)

            // send info
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.addedLocal, {name: player.name, map: map.name})]);
            Logger.info(`Local map ${stripFormatting(map.name)} (${link}) was added to the map list.`);
        }

        if (source.toLocaleLowerCase() === 'url') {

            let directory = this.nextcontrol.status.directories.maps + '/URL/',
                filename = link.split('/').pop();

            // fix file name ending
            if (!filename.endsWith('.Map.Gbx'))
                filename += '.Map.Gbx';

            // ensure the directory we save to exists
            if (!fs.existsSync(directory)) fs.mkdirSync(directory);

            // download map
            const request = await got(link, {headers: TMX.headers, encoding: 'binary'});
            const mapFile = request.rawBody;

            // write map to the TMX folder
            fs.writeFileSync(directory + filename, mapFile);

            // get map info
            let map = new Classes.Map(await this.nextcontrol.client.query('GetMapInfo', [directory + filename]));
            map.setTMXId(await TMX.getID(map.uid));

            // add map to the map list
            await this.addmapToServer(directory + filename, map)

            // send info
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.admin.addedUrl, {
                name: player.name,
                map: map.name
            })]);
            Logger.info(`${stripFormatting(map.name)} was downloaded from URL (${link}) and added to the map list.`);

        }
    }

    /**
     * Adds a map to the server
     * @param path {String} absolute! path to the map
     * @param map {Classes.Map} map object
     * @returns {Promise<void>}
     */
    async addmapToServer(path, map) {
        // add map
        await this.nextcontrol.client.query('InsertMap', [path]);

        // add map to the database
        if (dbtype === 'mongodb') {
            await this.nextcontrol.mongoDb.collection('maps').insertOne(map);
        } else if (dbtype === 'mysql') {
            await this.nextcontrol.mysql.query('INSERT INTO maps VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                map.uid,
                map.name,
                map.file,
                map.author,
                map.mood,
                map.medals,
                map.coppers,
                map.isMultilap,
                map.nbLaps,
                map.nbCheckpoints,
                map.type,
                map.style,
                map.tmxid
            ]).catch(err => {
                Logger.error(err)
            });
        }
    }

}