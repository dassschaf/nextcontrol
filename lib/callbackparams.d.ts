//
// class wrappers for callback paramter arrays
// Type definitions file
//

import * as Classes from './classes.js';
import { LoggerOptions } from 'mongodb';
import { ManialinkAnswerEntry } from './callbackparams.js';

/**
 * Class representing the Player connect callback parameters
 */
export class PlayerConnect {
    constructor(params : Array)  

    /**
     * Joining player's login
     */
    login       : string;

    /**
     * Whether the joining player is spectator or not
     */
    isSpectator : boolean
}

/**
 * Class representing the Player disconnect callback parameters
 */
export class PlayerDisconnect { 
    constructor(params : Array)

    /**
     * Disconnected player's login
     */
    login   : string

    /**
     * Reason why the player disconnected
     */
    reason  : string
}

/**
 * Class representing the Chat message callback parameters
 */
export class ChatMessage {
    constructor(params : Array)

    /**
     * Message sender's unique identifier
     */
    playerUid : string

    /**
     * Message sender's login
     */
    login : string

    /**
     * Message text
     */
    text : string

    /**
     * Whether the message is a command or not
     */
    isCommand : boolean
}

/**
 * Class representing the match results of a match
 */
export class MatchResults {
    constructor(params : Array)

    /**
     * Array of Player Ranking objects containing the matches results
     */
    ranking : Array<Classes.PlayerRanking>

    /**
     * Winning Team's ID
     */
    winningTeam : number
}

/**
 * Class representing a change in map list
 */
export class MaplistChange {
    constructor(params : Array)

    /**
     * Current map's index in the maplist
     */
    current : number

    /**
     * Next map's index in the maplist 
     */
    next : number

    /**
     * Whether the map list had been modified or not
     */
    isModified : boolean
}

/**
 * Callback parameters from a gamemode script
 */
export class ModeScriptCallback {
    constructor(params : Array)

    /**
     * Callback parameters from a gamemode script
     */
    parameters : Array<string>
}

/**
 * Manialink Page answer
 */
export class ManialinkPageAnswer {
    constructor(params : Array)

    /**
     * Player's unique identifier
     */
    playerUid : string

    /**
     * Player's login
     */
    login : string

    /**
     * Player's answer
     */
    answer : string
    
    /**
     * Array of entries
     */
    entries : Array<ManialinkAnswerEntry>
}

/**
 * Class representing Manialink Page Answer entries
 */
export class ManialinkAnswerEntry {
    /**
     * Constructs the Entry from the entry array returend by the server upon the ManialinkPageAnswer callback
     * @param entryStruct has format {Name: xyz, Value: abc}
     */
    constructor(entryStruct : any)

    /**
     * Entry name
     */
    name : string

    /**
     * Entry value
     */
    value : string
}

/**
 * Tunnel Data as recieved
 */
export class TunnelData {
    constructor(params : Array)

    /**
     * Sending player's unique identifier
     */
    playerUid : string

    /**
     * Sending player's login
     */
    login : string

    /**
     * string of base64 encoded data
     */
    data : string
}

/**
 * Class representing the player passes checkpoint callback parameters
 */
export class PlayerCheckpoint {
    constructor(params : Array)

    /**
     * Player's unique identifier
     */
    playerUid : string

    /**
     * Player's login
     */
    login : string 

    /**
     * Time/Score the player had when passing checkpoint
     */
    timeOrScore : number

    /**
     * Player's current lap
     */
    currentLap : number 

    /**
     * The number of the current checkpoint
     */
    currentCp : number 

}

/**
 * Class representing the player finishes run callback parameters
 */
export class PlayerFinish {
    constructor(params : Array)

    /**
     * Player's unique identifier
     */
    playerUid : string

    /**
     * Player's login
     */
    login : string 

    /**
     * Time/score reached when finishing the run
     */
    timeOrScore : number
}

/**
 * Class representing the player run invalidated callback parameters
 */
export class PlayerIncoherence {
    constructor(params : Array)

    /**
     * Player's unique identifier
     */
    playerUid : string

    /**
     * Player's login
     */
    login : string 
}