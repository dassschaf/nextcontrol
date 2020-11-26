//
// class wrappers for callback paramter arrays
//

import * as Classes from './classes.js';

/**
 * Class representing the match results of a match
 */
export class MatchResults {
    constructor(params) {
        this.ranking = [];

        params[0].forEach(ranking => {
            this.ranking.push(new Classes.PlayerResults(ranking));
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