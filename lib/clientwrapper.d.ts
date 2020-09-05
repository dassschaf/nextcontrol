/*
 *  NextControl wrapper for common 
 *  Type Definitions file
 */



import * as Classes from './classes.js';

export class ClientWrapper {
    constructor(client : any);

    async getVersion()  : Classes.ServerVersion;
    async getStatus()   : Classes.ServerStatus;
}