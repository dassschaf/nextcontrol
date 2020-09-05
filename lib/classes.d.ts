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
}

/**
 * Map Info object
 */
export class Map {

}