import Client from "gbxremote/lib/client";
import { ClientWrapper } from "./lib/clientwrapper";
import { Db } from "mongodb";
import { DatabaseWrapper } from "./lib/dbwrapper";
import * as Classes from "./lib/classes";

export class NextControl {
    
    /**
     * Do not instatiate this class yourself, the only existing object should be passed around by the object itself!
     */
    constructor()

    /**
     * Prepares NextControl to be ready for use
     */
    startup() : void 

    /**
     * Function, listening to server callbacks when called
     * @returns false, when 
     */
    startListening() : boolean

    /**
     * GBXremote client object
     */
    client : Client

    /**
     * GBXremote client wrapper object, containing varous functions for commonly used xml-rpc methods
     */
    clientWrapper : ClientWrapper

    /**
     * MongoDB client object, accessing the controller's specified database
     */
    database : Db

    /**
     * MongoDB client wrapper object, containing various functions for commonly done queries and actions
     */
    databaseWrapper : DatabaseWrapper

    /**
     * Flag will be set to true, once the class instance is ready for listening.
     */
    isReady : boolean

    /**
     * List of registered chat commands
     */
    chatCommands : Array<ChatCommand>

    /**
     * List of registered admin chat commands
     */
    adminChatCommands : Array<ChatCommand>

    /**
     * Registers a chat command to be used
     * @param commandDefinition Object containing the definitions for the command
     */
    registerChatCommand(commandDefinition : Classes.ChatCommand) : void

    /**
     * Registers an admin command to be used
     * @param commandDefinition Object containing the definitions for the command
     */
    registerAdminCommand(commandDefinition : Classes.ChatCommand) : void
    
}

