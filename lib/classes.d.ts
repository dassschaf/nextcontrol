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
    bronze  : number;
    silver  : number;
    gold    : number;
    author  : number;
}