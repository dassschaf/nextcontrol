//
// class wrappers for callback paramter arrays
//

import * as Classes from './classes.js';

/**
 * Class representing the Player connect callback parametrs
 */
export class PlayerConnect {
    constructor(params) {
        this.login = String(params[0]);
        this.isSpectator = Boolean(params[1]);
    }
}

/**
 * Class representing the Player disconnect callback parameters
 */
export class PlayerDisconnect {
    constructor(params) {
        this.login = params[0];
        this.reason = params[1];
    }
}

/**
 * Class representing the chat message callback parameters
 */
export class ChatMessage {
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
        this.text = params[2];
        this.isCommand = Boolean(params[3]);
    }
}

/**
 * Class representing the match results of a match
 */
export class MatchResults {
    constructor(params) {
        this.ranking = [];

        params[0].forEach(ranking => {
            this.ranking.push(new Classes.PlayerRanking(ranking));
        });

        this.winningTeam = Number(params[1]);
    }
}

/**
 * Class representing a change in map list
 */
export class MaplistChange {
    constructor(params) {
        this.current = Number(params[0]);
        this.next = Number(params[1]);
        this.isModified = Boolean(params[2]);
    }
}

/**
 * Callback parameters from a gamemode script
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
 */
export class ManialinkPageAnswer {
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
        this.answer = params[2];
        this.entries = [];

        params[3].forEach(entry => {
            this.entries.push(new ManialinkAnswerEntry(entry));
        });
    }
}

/**
 * Class representing Manialink Page Answer entries
 */
export class ManialinkAnswerEntry {
    constructor (entryStruct)
    {
        this.name = entryStruct.Name;
        this.value = entryStruct.Value;
    }
}

/**
 * Tunnel Data as recieved
 */
export class TunnelData { 
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
        this.data = params[2];
    }
}

/**
 * Class representing the player passes checkpoint callback parameters
 */
export class PlayerCheckpoint {
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
        this.timeOrScore = Number(params[2]);
        this.currentLap = Number(params[3]);
        this.currentCp = Number(params[4]);
    }
}

/**
 * Class representing the player finishes run callback parameters
 */
export class PlayerFinish {
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
        this.timeOrScore = Number(params[2]);
    }
}

/**
 * Class representing the player run invalidated callback parameters
 */
export class PlayerIncoherence {
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
    }
}

/**
 * Class representing an updated bill
 */
export class UpdatedBill {
    constructor(params) {
        this.billId = Number(params[0]);
        this.state = Number(params[1]);
        this.stateName = params[2];
        this.transactionId = params[3];
    }
}