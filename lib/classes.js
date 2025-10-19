/*
 *  NextControl library of commonly used classes
 *  
 */

import { NextControl } from "../nextcontrol.js";
import { Settings } from "../settings.js";
import { logger } from "./utilities.js";
import {Logger} from "./logger.js";

/**
 * Game Server Version information
 */
export class ServerVersion {

    constructor(struct) {
        this.name = struct.Name;
        this.title = struct.TitleId;
        this.version = struct.Version;
        this.build = struct.Build;
        this.apiVersion = struct.ApiVersion;
    }
}

/**
 * Map medals object
 */
export class Medals {

    constructor(b, s, g, a)
    {
        this.bronze = b;
        this.silver = s;
        this.gold = g;
        this.author = a;
    }

    reachedMedal(time) {
        if (time > this.silver && time <= this.bronze) return 'bronze';
        if (time > this.gold && time <= this.silver) return 'silver';
        if (time > this.author && time <= this.gold) return 'gold';
        if (time <= this.author) return 'author';
        return false;
    }
}

/**
 * 
 */
export class Map {

    /**
     * constructs a map from the server's returned struct
     * @param {*} struct Struct as returned from the server
     */
    constructor(struct) {
        this.uid = struct.UId;
        this.name = struct.Name;
        this.file = struct.FileName;
        this.author = struct.Author;
        this.envi = struct.Environnement;
        this.mood = struct.Mood;
        this.medals = new Medals(struct.BronzeTime, struct.SilverTime, struct.GoldTime, struct.AuthorTime);
        this.coppers = Number(struct.CopperPrice);
        this.isMultilap = Boolean(struct.LapRace);
        this.nbLaps = Number(struct.NbLaps);
        this.nbCheckpoints = Number(struct.NbCheckpoints);
        this.type = struct.MapType;
        this.style = struct.MapStyle;
        this.tmxid = -1;
    }

    setTMXId(id) { this.tmxid = id }

    static fromDb(map) {
        let struct = {
            UId: map.uid,
            Name: map.name,
            FileName: map.file,
            Author: map.author,
            Environnement: map.envi,
            BronzeTime: map.medals.bronze,
            SilverTime: map.medals.silver,
            Mood: map.mood,
            GoldTime: map.medals.gold,
            AuthorTime: map.medals.author,
            CopperPrice: map.coppers,
            LapRace : map.isMultilap,
            NbLaps: map.nbLaps,
            NbCheckpoints: map.nbCheckpoints,
            MapType: map.type,
            MapStyle: map.MapStyle
        };

        let newMap = new Map(struct);
        newMap.setTMXId(map.tmxid);

        return newMap;
    }
}

/**
 * Server Status information
 */
export class ServerStatus {
    /**
     * Constructs server status info object
     * @param struct status struct returned from server
     */
    constructor(struct) {
        this.code = Number(struct.Code);
        this.name = struct.Name;
    }

    static fromCallback(params) {
        return new ServerStatus({
            Code: Number(params[0]),
            Name: params[1]
        });
    }
}

/**
 * Call Vote information
 */
export class CallVote {
    /**
     * Constructs call vote status from server struct
     * @param struct call vote struct returned from server
     */
    constructor(struct) {
        this.login = struct.CallerLogin;
        this.command = struct.CmdName;
        this.parameter = struct.CmdParam;
    }

    /**
     * Constructs call vote information from callback parameters
     * @param params callback parameters
     */
    static fromCallback(params) {
        return new CallVote ({
            CallerLogin: params[1],
            CmdName: params[2],
            CmdParam: params[3]
        });
    }
}

/**
 * Object for ChatSendServerMessageToLanguage method's parameter array
 */
export class LanguageMessage {
    /**
     * @param lang Message language
     * @param text Message content
     */
    constructor(lang, text) {
        this.lang = lang;
        this.text = text;
    }
}

/**
 * Player Info as returned from server
 */
export class PlayerInfo {
    /**
     * Constructs player info from returned struct
     * @param struct struct returned from server
     */
    constructor(struct) {
        this.login = struct.Login;
        this.name = struct.NickName;
    }
}

/**
 * Object containing a player's results after a match
 */
export class PlayerResults {
    /**
     * Constructs player ranking from returend struct
     * @param struct struct returned from server
     */
    constructor(struct) {
        this.login = struct.Login;
        this.name = struct.NickName;
        this.rank = struct.Rank;
        this.bestTime = Number(struct.BestTime);
        this.bestCheckpoints = []
        if (struct.BestCheckpoints !== undefined) struct.BestCheckpoints.forEach(v => { this.bestCheckpoints.push(Number(v))});
        this.score = Number(struct.Score);
        this.nbLaps = Number(struct.NbrLapsFinished);
        this.ladderScore = Number(struct.LadderScore);
    }   
}

/**
 * Chat Command definition containing command name and command handler
 */
export class ChatCommand {
    constructor(name, handlerFunction, description, pgname) {
        this.commandName = name;
        this.commandHandler = handlerFunction;
        this.commandDescription = description;
        this.pluginName = pgname;
    }   

    toString() { return this.commandName; }
}

/**
 *  Class representing a local record
 */
export class LocalRecord {
    constructor(login, time, map) {
        this.login = login;
        this.time = time;
        this.map = map;
    }
}

/**
 * Class representing the current server status
 */
export class Status {

    /**
     * initializes the status object
     * @param {NextControl} nc 
     */
    async init(nc) {
        // init players array:
        this.players = [];
        let playerList = await nc.client.query('GetPlayerList', [1000, 0, 1])
        playerList.forEach(player => this.players.push(new PlayerInfo(player)));

        // init current map object
        this.map = new Map(await nc.client.query('GetCurrentMapInfo'));

        // init directories
        this.directories = {
            maps: await nc.client.query('GetMapsDirectory'),
            skins: await nc.client.query('GetSkinsDirectory'),
            gamedata: await nc.client.query('GameDataDirectory')
        }
    };

    /**
     * Removes a player from the list
     * @param {String} login 
     */
    removePlayer(login) {
        let i = 0;

        this.players.forEach((p, id) => {
            if (p.login === login) i = id;
        });

        this.players.splice(i, 1);
    }

    /**
     * Adds a player to the list
     * @param {PlayerInfo} player 
     */
    addPlayer(player) {
        this.players.push(player);
    }

    /**
     * Returns the player from the list, based off their login
     * @param {String} login 
     * @returns {PlayerInfo} player
     */
    getPlayer(login) {
        // create temporary empty object, should we not find a player in the list
        // this should only happen if the player joined when the script was offline.
        let player = {
            name: "",
            login: ""
        };

        this.players.forEach(p => {
            if (p.login === login) player = p;
        });

        return player;
    }

    /**
     * Returns if a player with a given login is online
     * @param {String} login 
     * @returns {Boolean} true if online
     */
    playerOnline(login) {
        this.players.forEach(p => {
            if (p.login === login) return true;
        });

        return false;
    }
}

/**
 * Class representing the information sent by the mode script, when a waypoint is passed by a player
 */
export class WaypointInfo {

    /**
     * Constructs an object from the callback parameter struct
     * @param {Object} para
     */
    constructor(para) {
        this.time = Number(para.time);
        this.login = String(para.login);
        this.accountId = String(para.accountid);
        this.raceTime = Number(para.racetime);
        this.lapTime = Number(para.laptime);
        this.nbCheckpointInRace = Number(para.checkpointinrace);
        this.nbCheckpointInLap = Number(para.checkpointinlap);
        this.isEndRace = Boolean(para.isendrace);
        this.isEndLap = Boolean(para.isendlap);
        this.isInfiniteLaps = Boolean(para.isinfinitelaps);
        this.isIndependentLaps = Boolean(para.isindependentlaps);
        this.blockId = String(para.blockid);
        this.speed = Number(para.speed);
    }

    isFinish() { return this.isEndRace === true }
    isCheckpoint() { return (this.isEndRace === false && this.isEndLap === false) }
    isLap() { return this.isEndRace === false && this.isEndLap === true }
}

export class Jukebox {

    /**
     * List of Maps in the Jukebox, treated as a queue
     * @type {Array<JukeboxEntry>}
     */
    maps = [];

    /**
     * Adds a map to the end of the queue
     * @param {Map} map Map to be jukeboxed
     * @param {PlayerInfo} player acting player's info
     */
    queueMap(map, player) {
        this.maps.push(new JukeboxEntry(map, player));
    }

    /**
     * Adds a map to the front of the queue
     * @param {Map} map Map to be jukeboxed
     * @param {PlayerInfo} player Acting player's info
     */
    priorityAdd(map, player) {
        this.maps.unshift(new JukeboxEntry(map, player));
    }

    /**
     * Returns the next map from the Queue and unqueues it
     * @returns {JukeboxEntry} Entry in the queue or false if the queue is empty
     */
    unqueueMap() {
        return (this.maps.length > 0) ? this.maps.shift() : false;
    }

    /**
     * Returns whether the Jukebox is empty or not
     * @returns {Boolean} true if empty
     */
    isEmpty() {
        return this.maps.length === 0
    }

    reset() {
        this.maps = [];
    }

}

/**
 * Class representing an entry in the Jukebox
 */
export class JukeboxEntry {

    constructor(map, player) {
        this.map = map;
        this.player = player;
    }

}

/**
 * Takes care of all sorts of mode settings shenanigans
 */
export class ModeSettingsController {

    /**
     * Default mode settings
     */
    defaultSettings = {}    

    /**
     * Current temporary settings, reset upon each map change
     */
    tempSettings = {}

    /**
     * Reference to main class instance
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Sets up the mode settings controller
     * @param {NextControl} nextcontrol 
     */
    constructor(nextcontrol) {
        this.nextcontrol = nextcontrol;
    }

    async init() {
        this.defaultSettings = await this.nextcontrol.client.query('GetModeScriptSettings');

        // remove some settings that currently cause problems for some reason:
        delete this.defaultSettings['S_MatchmakingRematchRatio'];

        this.tempSettings = JSON.parse(JSON.stringify(this.defaultSettings));
    }

    /**
     * Shorthand function to immediately extend the current playing time and apply that setting.
     * @param {Number} time in seconds
     * @returns {Promise<boolean>}
     */
    async extendTime(time) {
        if (!this.isTimeExtendable()) return false;

        this.tempSettings['S_TimeLimit'] += Number(time);

        await this.applyTempSettings();
        return true;
    }

    /**
     * changes a setting in the current temporary settings storage
     * @param {String} setting Setting name
     * @param {any} value
     */
    changeSetting(setting, value) {
        if (!this.tempSettings.hasOwnProperty(setting)) return false;
        else this.tempSettings[setting] = value;
        return true;
    }

    /**
     * Resets a setting in the current temporary settings storage
     * @param {String} setting
     */
    resetSetting(setting) {
        if (!this.tempSettings.hasOwnProperty(setting)) return false;
        else this.tempSettings[setting] = this.defaultSettings[setting];
        return true;
    }

    /**
     * Applies the current temporary settings to the server
     * @returns {Promise<void>}
     */
    async applyTempSettings() {
        await this.nextcontrol.client.query('SetModeScriptSettings', this.tempSettings);
    }

    /**
     * Reads the currently saved on disk MatchSettings file
     * @returns {Promise<void>}
     */
    async readMatchSettings() {
        // reload file
        await this.nextcontrol.client.query('LoadMatchSettings', [this.nextcontrol.status.directories.maps + Settings.trackmania.matchsettings_file]);

        // reload settings to default
        await this.init();
    }

    /**
     * Keeps the changes done during the current map
     */
    keepTempSettings() {
        this.defaultSettings = JSON.parse(JSON.stringify(this.tempSettings));
    }

    /**
     * Saves the current server settings to file
     */
    async saveSettingsToFile() {
        let path = this.nextcontrol.status.directories.maps + '/MatchSettings/' + Settings.trackmania.matchsettings_file;

        await this.nextcontrol.client.query('SaveMatchSettings', [path]);
        Logger.info('Successfully wrote match settings to file: ' + path);
    }

    /**
     * Resets the temporary settings to the default settings at both server and this object
     * @returns {Promise<void>}
     */
    async resetSettings() {
        // reset settings on the server:
        await this.nextcontrol.client.query('SetModeScriptSettings', this.defaultSettings);

        // reset settings here:
        this.undoTempChanges();
    }

    /**
     * Undos the recently done changes to the temporary settings
     */
    undoTempChanges() {
        this.tempSettings = JSON.parse(JSON.stringify(this.defaultSettings));
    }

    /**
     * Returns whether the timelimit is changable
     */
    isTimeExtendable() {
        // if time is extendable, there's a key S_TimeLimit in the struct:
        return Object.keys(this.defaultSettings).includes('S_TimeLimit');
    }

    /**
     * Returns whether the current script settings have a setting
     * @param {String} name Setting name (e. g. S_TimeLimit)
     */
    hasSetting(name) {
        return Object.keys(this.defaultSettings).includes(name);
    }
}