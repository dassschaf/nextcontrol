import Client from "gbxremote/lib/client";
import { Db } from "mongodb";
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
     * Current server status
     */
    status : Classes.Status

    /**
     * Object containing Dictionaries (login => list), to store query results in
     */
    lists : {

        /**
         * List containing an array of PlayerInfos from a previous query. Key is the player login starting a query before.
         */
        players : Map<String, Array<Classes.PlayerInfo>>,

        /**
         * List containing an array of Maps from a previous query. Key is the player login starting a query before.
         */
        maps : Map<String, Array<Classes.Map>>
    }

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

