import { NextControl } from "../nextcontrol.js";
import fs from 'fs';
import * as Classes from '../lib/classes.js';
import { ServerLib } from '../lib/serverLib.js';
import { Sentences } from "../lib/sentences.js";

const settingsPath = './settings/forceMods.json'

const defaultSettings = {
    override: false
}

export class ForceModsPlugin {

    name = 'Force Mod'

    author = 'dassschaf'

    description = 'Adds a toolset to enforce mods on a server'

    initialApplication = false;

    /**
     * Constructs the plugin
     * @param {NextControl} nc
     */
    constructor(nc) {
        // save reference
        this.nc = nc;

        this.server = new ServerLib(nc);

        if (fs.existsSync('.' + settingsPath))
            this.settings = fs.readdirSync('.' + settingsPath)
        else {
            this.settings = defaultSettings;

            // write settings file
            this.saveSettings();
        }

        nc.registerAdminCommand(new Classes.ChatCommand('forcemods', this.forceModsCommand, 'Enable, disable and change forced mods on the server', this.name));
    }

    /**
     * Chat command of the plugin
     * @param {String} login
     * @param {Array<String>} params
     * @returns {Promise<void>}
     */
    async forceModsCommand(login, params) {

        // The plugin currently supports TM2020 only.
        // for more environments, adjust:
        //  - params to be treated as [ENVI, URL]

        if (params.length === 0) {
            await this.server.chatMessageToLogin(login, Sentences.admin.forceMod.invalid);
            return;
        }

        // save settings
        if (params[0] === 'save') {
            this.saveSettings()
            await this.server.chatMessageToLogin(login, Sentences.admin.forceMod.saved);
            return;
        }

        // load settings
        if (params[0] === 'read') {
            this.readSettings()
            await this.applySettings();
            await this.server.chatMessageToLogin(login, Sentences.admin.forceMod.read);
            return;
        }

        // reset settings
        if (params[0] === 'reset') {
            this.resetSettings();
            await this.applySettings();
            await this.server.chatMessageToLogin(login, Sentences.admin.forceMod.reset);
            return;
        }

        // disable override
        if (params[0] === 'disable') {
            this.settings.override = false;
            await this.applySettings();
            await this.server.chatMessageToLogin(login, Sentences.admin.forceMod.overrideOff);
            return;
        }

        // enable override
        if (params[0] === 'enable') {
            this.settings.override = true;
            await this.applySettings();
            await this.server.chatMessageToLogin(login, Sentences.admin.forceMod.overrideOn);
            return;
        }

        // Otherwise the parameter is an URL (hopefully)
        const envi = 'Stadium',
            url = params.shift();

        this.settings[envi] = url;
        await this.applySettings();
        await this.server.chatMessageToLogin(login, Sentences.admin.forceMod.applied);
    }

    /**
     * Saves the settings
     */
    saveSettings() {
        let jsonString = JSON.stringify(this.settings);
        fs.writeFileSync(settingsPath, jsonString);
    }

    /**
     * Reads the settings from file
     */
    readSettings() {
        if (fs.existsSync(settingsPath))
            this.settings = fs.readdirSync(settingsPath)
        else {
            this.settings = defaultSettings;

            // write settings file
            this.saveSettings();
        }
    }

    resetSettings() {
        this.settings = defaultSettings;
    }

    /**
     * Applies the current settings to the server
     * @returns {Promise<void>}
     */
    async applySettings() {
        // make array of structs like the server wants
        let modArray = [];
        Object.keys(this.settings).forEach(key => {
            if (key !== 'override')
                modArray.push({Env: key, Url: this.settings[key]});
        })

        // send settings to server
        await this.nc.client.query('SetForcedMods', [this.settings.override, modArray]);
    }

    /**
     * Function run on map end --- will apply the mod settings after NextControl launches once.
     * @param {Classes.Map} map
     * @returns {Promise<void>}
     */
    async onEndMap(map) {
        if (!this.initialApplication)
            await this.applySettings();
    }
}
