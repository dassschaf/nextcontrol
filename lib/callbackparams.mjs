//
// class wrappers for callback paramter arrays
//

import * as classes from './classes.mjs';

/**
 * Class representing the Player connect callback parametrs
 * @member login Player login
 * @member isSpectator whether Player is joining as Spectator or not
 */
export class PlayerConnect {
    constructor(params) {
        this.login = params[0];
        this.isSpectator = params[1];
    }
}

/**
 * Class representing the Player disconnect callback parameters
 * @member login player login
 * @member reason Disconnect reason
 */
export class PlayerDisconnect {
    constructor(params) {
        this.login = params[0];
        this.reason = params[1];
    }
}

/**
 * Class representing the chat message callback parameters
 * @member playerUid Player's unique identifier
 * @member login Player's login
 * @member text Message text
 * @member isCommand whether the message is a command or not
 */
export class ChatMessage {
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
        this.text = params[2];
        this.isCommand = params[3];
    }
}

/**
 * Object representing the match results of a match
 * @member winningTeam - ID of the team that won the match
 * @member ranking - Array of PlayerRanking objects (see classes.mjs)
 */
export class MatchResults {
    constructor(params) {
        this.ranking = [];

        params[0].forEach(ranking => {
            this.ranking.push(classes.PlayerRanking(ranking));
        });

        this.winningTeam = params[1];
    }
}

/**
 * Object representing a change in map list
 * @member current current map's index
 * @member next next map's index
 * @member isModified whether the maplist has been modified or not
 */
export class MaplistChange {
    constructor(params) {
        this.current = params[0];
        this.next = params[1];
        this.isModified = params[2];
    }
}

/**
 * Callback parameters from a mode script containing two or more parameters
 * @member parameters Array of parameters (strings)
 */
export class ModeScriptCallback {
    constructor(params) {
        this.parameters = [];
        if (params[1].isArray())
            this.parameters = [params[0]].concat(params[1]);
        else
            this.parameters = [params[0], params[1]];
    }
}

/**
 * Manialink Page answer
 * @member playerUid player's unique ID
 * @member login player's login
 * 
 */
export class ManialinkPageAnswer {
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
        this.answer = params[2];
        this.entries = {};

        params[3].forEach(entry => {
            this.entries[entry.Name] = entry.Value;
        });
    }
}

/**
 * Tunnel Data as recieved
 * @member playerUid player's unique ID
 * @member login player's login
 * @member data base64 encoded data string
 */
export class TunnelData { 
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
        this.data = params[2];
    }
}

export class PlayerCheckpoint {
    constructor(params) {
        
    }
}