//
// class wrappers for callback paramter arrays
//

import * as classes from './classes.mjs';

/**
 * Class representing the Player connect callback parametrs
 * @member login - Player login
 * @member isSpectator - whether Player is joining as Spectator or not
 */
export class PlayerConnect {
    /**
     * Constructs PlayerConnect object from params array
     * @param params array of parameters from callback
     */
    constructor(params) {
        this.login = params[0];
        this.isSpectator = params[1];
    }
}

/**
 * Class representing the Player disconnect callback parameters
 * @member login - Player login
 * @member reason - Disconnect reason
 */
export class PlayerDisconnect {
    /**
     * Constructs PlayerDisconnect object from params array
     * @param params array of parameters from the callback
     */
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
    /**
     * Constructs ChatMessage object from params array
     * @param params 
     */
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
        this.text = params[2];
        this.isCommand = params[3];
    }
}

export class MatchResults {
    constructor(params) {
        this.ranking = [];

        params[0].forEach(ranking => {
            this.ranking.push(classes.PlayerRanking(ranking));
        });

        this.winningTeam = params[1];
    }
}

export class MaplistChange {
    constructor(params) {
        this.current = params[0];
        this.next = params[1];
        this.isModified = params[2];
    }
}

export class ModeScriptCallback {
    constructor(params) {
        this.parameters = [];
        if (params[1].isArray())
            this.parameters = [params[0]].concat(params[1]);
        else
            this.parameters = [params[0], params[1]];
    }
}

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