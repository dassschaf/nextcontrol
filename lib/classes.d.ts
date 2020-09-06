/*
 *  NextControl library of commonly used classes
 *  Type Definitions file
 */

import { ClientWrapper } from "./clientwrapper.js"
import { DatabaseWrapper } from './dbwrapper.js'


export class WrapperList {
    /**
     * constructs the wrapper list
     * @param client Client wrapper object
     * @param database DatabaseWrapper object
     */
    constructor (client : ClientWrapper, database : DatabaseWrapper)

    /**
     * Client wrapper object
     */
    client      : ClientWrapper;

    /**
     * Database wrapper object
     */
    database    : DatabaseWrapper;
}

/**
 * Game Server Version information
 */
export class ServerVersion {
    /**
     * Server's name
     */
    name        : string;

    /**
     * Server's titlepack
     */
    title       : string;

    /**
     * Server executable version
     */
    version     : string;

    /**
     * Server executable build
     */
    build       : string;

    /**
     * API-Version in use by script
     */
    apiVersion  : string;
}

/**
 * Map medals object
 */
export class Medals {
    /**
     * Constructor to construct Medals objects
     * @param b Bronze Medal time
     * @param s Silver Medal time
     * @param g Gold Medal time
     * @param a Author Medal time = Validation time
     */
    constructor(b : number, s : number, g : number, a : number)

    /**
     * Bronze time (in ms)
     */
    bronze  : number;

    /**
     * Silver time (in ms)
     */
    silver  : number;

    /**
     * Gold time (in ms)
     */
    gold    : number;

    /**
     * Author's validation time (in ms)
     */
    author  : number;

    /**
     * Determines what medal the player got
     * @param {number} time Player's reached time
     * @returns {string|boolean} Medal name or 'false' when no medal reached
     */
    reachedMedal(time : number) : string | boolean;
}

/**
 * Server Status information
 */
export class ServerStatus {
    constructor(struct)

    /**
     * Status name
     */
    name : string

    /**
     * Status code
     */
    code : number 
}

/**
 * Map Info object
 */
export class Map {
    /**
     * Map's unique identifier
     */
    uid : string;

    /**
     * Map's name
     */
    name : string;

    /**
     * Map's file path (relative to server/UserData/Maps/)
     */
    file : string;

    /**
     * Map's author's login
     */
    author : string;

    /**
     * Map Environment
     */
    envi : string;

    /**
     * Map's mood = time of day
     */
    mood : string;

    /**
     * Map's medals
     */
    medals : Medals;

    /**
     * Map's coppers weight
     */
    coppers : number;

    /**
     * Whether it's a multilap track
     */
    isMultilap : boolean;

    /**
     * Map's number of laps
     */
    nbLaps : number;
    
    /**
     * Map's number of checkpoints
     */
    nbCheckpoints : number;

    /**
     * Map type
     */
    type : string;

    /**
     * Map's style
     */
    style : string;

    /**
     * Map's ID on TMX
     * -- default value if the object is returned from the server is 
     * -- if the object is taken from the database it is the actual TMX ID
     */
    tmxid : number;

    /**
     * Constructs a Map object from the callback parameters array
     * @param params callback parameters array
     */
    static fromCallback(params : Array) : Map

    /**
     * Sets the current map's TMX ID, for use when ID is incorrect
     * @param id new (correct) ID
     */
    setTMXId(id : number) : void;
}

/**
 * Call Vote information
 */
export class CallVote { 
    /**
     * Login of player, who started the vote
     */
    login : string;

    /**
     * Vote command
     */
    command : string;

    /**
     * Vote parameter
     */
    parameter : string;

    /**
     * Constructs call vote information from callback parameters
     * @param params callback parameters
     */
    static fromCallback (params : Array<string>) : CallVote;
}

/**
 * Object for ChatSendServerMessageToLanguage method's parameter array
 */
export class LanguageMessage {
    /**
     * @param lang Message language
     * @param text Message content
     */
    constructor(lang : string, text : string);

    /**
     * Message Language
     */
    lang : string;

    /**
     * Message Content
     */
    text : string;
}

/** Player Info as returned from server */
export class PlayerInfo {
    /**
     * Constructs player info from returned struct
     * @param struct struct as returend from server
     */
    constructor(struct)

    /**
     * Constructs player info from database result
     * @param dbstruct Object as returned from database
     */
    static fromDatabase(dbstruct) : PlayerInfo

    /**
     * Player's login
     */
    login : string

    /**
     * Player's name
     */
    name  : string
}

/**
 * Object containing a player's results after a match
 */
export class PlayerResults {

    /**
     * Constructs player ranking from returend struct
     * @param struct struct returned from server
     */
    constructor(struct)

    /**
     * Player's Login
     */
    login           : string

    /**
     * Player's name
     */
    name            : string

    /**
     * Player's rank
     */
    rank            : string

    /**
     * Player's best time on the track
     */
    bestTime        : number 

    /**
     * Player's best checkpoint times
     */
    bestCheckpoints : Array<number>

    /**
     * Player's score
     */
    score           : number

    /**
     * Number of laps driven
     */
    nbLaps          : number 

    /**
     * Gained ladder score
     */
    ladderScore     : number
}
