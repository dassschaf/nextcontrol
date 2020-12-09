/*
 *  NextControl library of commonly used classes
 *  Type Definitions file
 */
import { NextControl } from "../nextcontrol.js";

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

    /**
     * Constructs a Server Status object from the callback parameters as given, when Server status changes
     * @param params callback params
     */
    static fromCallback(params : Array<any>) : ServerStatus
}

/**
 * Map Info object
 */
export class Map {
    /**
     * Constructs a new map object
     * @param struct Struct, as returned from the dedicated server
     */
    constructor(struct: any)

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
     * -- default value if the object is returned from the server is -1 
     * -- if the object is taken from the database it is the actual TMX ID
     */
    tmxid : number;

    /**
     * Constructs a Map object from the callback parameters array
     * @param params callback parameters array
     */
    static fromCallback(params : Array<any>) : Map

    /**
     * Sets the current map's TMX ID, for use when ID is incorrect
     * @param id new (correct) ID
     */
    setTMXId(id : number) : void;

    /**
     * Creates a valid map object from database data
     * @param map Map struct
     */
    static fromDb(map) : Map
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

/**
 * Chat Command definition containing command name and command handler
 */
export class ChatCommand {
    /**
     * Constructs a new chat command definition to be registered at the main class
     * @param {string} name chat command name (the part after the slash)
     * @param {Function} handlerFunction Function handling the said chat command
     * @param {string} description chat command description
     * @param {string} pgname name of the plugin, registering the chat command
     */
    constructor(name : string, handlerFunction : Function, description : string, pgname : string)

    /**
     * command name
     */
    commandName : string 

    /**
     * function handling the chat command
     */
    commandHandler : (login : string, paramy : Array<string>, nextcontrol : NextControl) => void

    /**
     * command description, as displayed in the commands help
     */
    commandDescription : string

    /**
     * name of the plugin, registering the chat command
     */
    pluginName : string

    /**
     * Outputs command name as toString
     */
    toString() : string
}

/**
 *  Class representing a local record
 */
export class LocalRecord {
    /**
     * 
     * @param login player login
     * @param time record time or score
     * @param track track UID
     */
    constructor(login : string, time : number, track : string)

    /**
     * Player login
     */
    login : string

    /**
     * record time or score
     */
    time : number

    /**
     * track UID
     */
    track : string
}

/**
 * Class representing the current server status
 */
export class Status {

    /**
     * initializes the status object
     * @param {NextControl} nc 
     */
    init(nc) : void

    /**
     * Removes a player from the list
     * @param {String} login 
     */
    removePlayer(login : String) : void

    /**
     * Adds a player to the list
     * @param {PlayerInfo} player 
     */
    addPlayer(player : PlayerInfo) : void

    /**
     * Returns a player from the list, based on the player's login
     * @param player player login
     */
    getPlayer(player : String) : PlayerInfo

    /**
     * Returns if a player with a given login is online
     * @param {String} login 
     * @returns {Boolean} true if online
     */
    playerOnline(login : String) : Boolean

    /**
     * Returns, whether the current mode script supports time extension or not.
     */
    isTimeExtendable() : Boolean

    /**
     * currently played map
     */
    map : Map

    /**
     * Array of currently present players
     */
    players : Array<PlayerInfo>

    /**
     * Gamemode settings
     */
    modeScriptSettings : Object

    /**
     * List of directory paths on the server machine
     */
    directories : {
        /**
         * Maps directory path
         */
        maps : String

        /**
         * Skins directory path
         */
        skins : String

        /**
         * Gamedata directory path
         */
        gamedata : String 

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
    constructor(para) 

    /**
     * Overall time
     */
    time : Number

    /**
     * Player's login
     */
    login : String

    /**
     * Player's account ID
     */
    accountId : String

    /**
     * Time (in ms) since run start
     */
    raceTime : Number

    /**
     * Time (in ms) for the current lap
     */
    lapTime : Number

    /**
     * Number of the currently passed checkpoint in the current race
     */
    nbCheckpointInRace : Number 

    /**
     * Number of the currently passed checkpoint in the current lap
     */
    nbCheckpointInLap : Number

    /**
     * Is the current waypoint the finish?
     */
    isEndRace : Boolean

    /**
     * Is teh current waypoint the finish to end the current lap?
     */
    isEndLap : Boolean

    /**
     * Is the match set up to have infinite laps driven?
     */
    isInfiniteLaps : Boolean

    /**
     * Is the match set up to have each lap count as a finished run?
     */
    isIndependentLaps : Boolean

    /**
     * Block ID in the map file of the current waypoint
     */
    blockId : String

    /**
     * car speed in m/s
     */
    speed : Number

    /**
     * Is the current waypoint a trespassed and triggered finish?
     */
    isFinish() : Boolean

    /**
     * Is the current waypoint a trespassed and triggered checkpoint?
     */
    isCheckpoint() : Boolean

    /**
     * Is the current checkpoint a trespassed finish to finish a lap?
     */
    isLap() : Boolean
}

export class Jukebox {

    /**
     * List of Maps in the Jukebox, treated as a queue
     * @type {Array<JukeboxEntry>}
     */
    maps : Array<JukeboxEntry>

    /**
     * Adds a map to the end of the queue
     * @param {Map} map Map to be jukeboxed
     * @param {PlayerInfo} player Acting player's info
     */
    queueMap(map : Map, player : PlayerInfo) : void

    /**
     * Adds a map to the front of the queue
     * @param {Map} map Map to be jukeboxed
     * @param {PlayerInfo} player Acting player's info
     */
    priorityAdd(map : Map, player : PlayerInfo) : void

    /**
     * Returns the next map from the Queue and unqueues it
     * @returns {JukeboxEntry} Entry in the queue or false if the queue is empty
     */
    unqueueMap() : JukeboxEntry

    /**
     * Returns whether the Jukebox is empty or not
     * @returns {Boolean} true if empty
     */
    isEmpty() : Boolean

    /**
     * Resets the jukebox to be empty
     */
    reset() : void 

}

/**
 * Class representing an entry in the Jukebox
 */
export class JukeboxEntry {

    /**
     * Constructs an entry for the Jukebox queue
     * @param map Map info
     * @param player PlayerInfo of the player submitting a jukebox wish
     */
    constructor(map : Map, player : PlayerInfo)

    /**
     * Wished map
     */
    map : Map

    /**
     * Wishing player
     */
    player : PlayerInfo

}

/**
 * Takes care of all sorts of mode settings shenanigans
 */
export class ModeSettingsController {

    /**
     * Default mode settings
     */
    defaultSettings

    /**
     * Temporary settings storage
     */
    tempSettings

    /**
     * Reference to main class instance
     */
    nextcontrol

    /**
     * Sets up the mode settings controller
     * @param {NextControl} nextcontrol
     */
    constructor(nextcontrol : NextControl)

    /**
     * Shorthand function to immediately extend the current playing time
     * @param {Number} time in seconds
     * @returns {Promise<boolean>}
     */
    extendTime(time : Number) : Promise<boolean>

    /**
     * changes a setting for the current track
     * @param {String }setting Setting name
     * @param {any} value
     * @returns {Promise<boolean>}
     */
    changeSetting(setting, value) : Promise<boolean>

    /**
     * Returns whether the timelimit is changable
     */
    isTimeExtendable() : boolean

    /**
     * Resets the temporary settings to the default settings
     * @returns {Promise<void>}
     */
    resetSettings() : Promise<void>

    /**
     * Applies the current temporary settings to the server
     * @returns {Promise<void>}
     */
    applyTempSettings() : Promise<void>

    /**
     * Resets a setting in the current temporary settings storage
     * @param {String} setting
     * @returns {Promise<boolean>}
     */
    resetSetting(setting) : Promise<boolean>

    /**
     * Saves the current server settings to file
     */
    saveSettingsToFile() : Promise<void>

    /**
     * Saves the current temporary settings as the default settings
     */
    keepTempSettings() : void
}