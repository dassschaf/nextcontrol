/*
 *  NextControl library of commonly used classes
 *  
 */

import { NextControl } from "../nextcontrol.js";

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
        if (time > silver && time <= bronze) return 'bronze';
        if (time > gold && time <= silver) return 'silver';
        if (time > author && time <= gold) return 'gold';
        if (time <= author) return 'author';
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

    static fromCallback(params)
    {
        return new Map(params[0])
    }

    setTMXId(id) { this.tmxid = id }
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
        if (struct.BestCheckpoints != undefined) struct.BestCheckpoints.forEach(v => { this.bestCheckpoints.push(Number(v))});
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
 * Class representing the information of a chat command
 */
export class ChatCommandParameters {
    constructor(uid, login, params) {
        this.uid = uid;
        this.login = login;
        this.params = params;
    }
}

/**
 *  Class representing a local record
 */
export class LocalRecord {
    constructor(login, time, track) {
        this.login = login;
        this.time = time;
        this.track = track;
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

        // init current track object
        this.map = new Map(await nc.client.query('GetCurrentMapInfo'));

        // init current gamemode settings object
        this.modeScriptSettings = await nc.client.query('GetModeScriptSettings');

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
            if (p.login == login) i = id;
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
        let player = false;

        this.players.forEach(p => {
            if (p.login == login) player = p;
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
            if (p.login == login) return true;
        });

        return false;
    }

    isTimeExtendable() {
        return (typeof this.modeScriptSettings.S_TimeLimit != "undefined")
    }
}

/**
 * Class representing the information sent by the mode script, when a waypoint is passed by a player
 */
export class WaypointInfo {

    /**
     * Constructs an object from the callback parameter struct
     * @param {*} para 
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

    isFinish() { return this.isEndRace == true }
    isCheckpoint() { return (this.isEndRace == false && this.isEndLap == false) }
    isLap() { return this.isEndRace == false && this.isEndLap == true }
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
        return this.maps.length == 0
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