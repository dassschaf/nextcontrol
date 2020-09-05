/*
 *  NextControl library of commonly used classes
 *  Type Definitions file
 */


/**
 * Game Server Version information
 */
export class ServerVersion {
    name        : string;
    title       : string;
    version     : string;
    build       : string;
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

    bronze  : number;
    silver  : number;
    gold    : number;
    author  : number;

    /**
     * Determines what medal the player got
     * @param {number} time Player's reached time
     * @returns {string|boolean} Medal name or 'false' when no medal reached
     */
    reachedMedal(time : number) : string | boolean;
}

/**
 * Map Info object
 */
export class Map {
    uid : string;
    name : string;
    file : string;
    author : string;
    envi : string;
    mood : string;
    medals : Medals;
    coppers : number;
    isMultilap : boolean;
    nbLaps : number;
    nbCheckpoints : number;
    type : string;
    style : string;
    tmxid : number;

    setTMXId(id : number) : void;
}