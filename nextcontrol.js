/**
 * NextControl
 * A Trackmania (2020) dedicated server controller script
 * 
 * Main class file
 */

/**
 * Required libraries
 */
import gbxremote from 'gbxremote';
import mongodb from 'mongodb';

/**
 * Other imports
 */
import * as CallbackParams from './lib/callbackparams.js';
import * as Classes from './lib/classes.js';
import { logger } from './lib/utilities.js';
import { ClientWrapper } from './lib/clientwrapper.js';
import { DatabaseWrapper } from './lib/dbwrapper.js';
import { Settings } from './settings.js';
import { Sentences } from './lib/sentences.js';

/**
 * Main class containing the controller's brain
 */
export class NextControl {

    /**
     * Flag will be set to true, once the class instance is ready for listening.
     */
    isReady = false;

    /**
     * Do not instatiate this class yourself, the only existing object should be passed around by the object itself!
     */
    constructor () { /* poo poo */ }

    /**
     * Prepares NextControl to be ready for use
     */
    async onStartup() {
        logger('su', 'Starting NextControl...');

        // create Trackmania XMLRPC client
        let client = gbxremote.createClient(5555);
        let serverPromise = new Promise((resolve, reject) => {
            // upon connection
            client.on('connect', async () => {
                // wait for API-Version, Authentication and Callback enabling to succeed, otherwise reject the promise
                if (!(await client.query('SetApiVersion', ['2019-03-02']))) reject('api');
                if (!(await client.query('Authenticate', [Settings.trackmania.login, Settings.trackmania.password]))) reject('auth');
                if (!(await client.query('EnableCallbacks', [true]))) reject('callback');

                // and "return" the functioning client object
                resolve(client);
            });
        });

        // wait for promise
        let clientWrapper = new ClientWrapper(await serverPromise);
        logger('su', 'Connected to Trackmania Server');

        // set properties accordingly
        this.client = client;
        this.clientWrapper = clientWrapper;

        // woo, we're connected!
        this.clientWrapper.chatSendServerMessage('Starting NextControl ...');

        // create MongoDB client
        let database = new mongodb.MongoClient(Settings.database.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        
        // wait for database connection
        await database.connect();

        // set properties accordingly
        this.database = await database.db(Settings.database.database);
        this.databaseWrapper = new DatabaseWrapper(this.database);

        // woo, we're connected!
        logger('su', 'Connected to MongoDB Server');
        _client.chatSendServerMessage('Connected to database ...');

        // now lets load plugins:
        this.chatCommands = [];
        this.adminCommands = [];


        // now that we're done:
        this.isReady = true;
    }

    /**
     * Function, to start listening to the server and dealing with the server's callbacks
     */
    async startListening() {
        if (!this.isReady) return false

        client.on('callback', async (method, params) => {
            let p;
            switch (method) {
                case 'ManiaPlanet.PlayerConnect':
                    p = new CallbackParams.PlayerConnect(params);
                    plugins.forEach(plugin => { if (typeof plugin.onPlayerConnect != "undefined")  plugin.onPlayerConnect(p, this) });
                    break;
        
                case 'ManiaPlanet.PlayerDisconnect':
                    p = new CallbackParams.PlayerDisconnect(params);
                    plugins.forEach(plugin => { if (typeof plugin.onPlayerDisconnect != "undefined")  plugin.onPlayerDisconnect(p, this) });
                    break;
        
                case 'ManiaPlanet.PlayerChat':
                    p = new CallbackParams.ChatMessage(params);
        
                    // two quick and dirty debug commands:
                    if (p.text == '/shutdown' && Settings.admins.includes(p.login)) { await _client.chatSendServerMessage(Sentences.shuttingDown); logger('w', 'Shutting down after admin invoked "/shutdown" command'); process.exit(0); }

                    if (p.text == '/logline' && Settings.admins.includes(p.login))  logger('-----------');

                    // chat command handling
                    let command = p.text.split('/')[1].split(' ', 1)[0],
                        params = p.text.split('/')[1].split(' ', 1)[1];

                    if (p.isCommand && command == admin) {
                        // handle admin command, command is "first" parameter
                        
                        let adminCommand = params.split(' ', 1)[0],
                            adminParams = params.split(' ', 1)[1];

                        this.adminCommands.forEach(commandDefinition => {
                            if (commandDefinition.commandName === adminCommand) 
                                commandDefinition.commandHandler(
                                    new Classes.ChatCommandParameters(p.playerUid, p.login, adminParams),
                                    this
                                );
                        });
                    }
                    
                    else if (p.isCommand) {
                        // handle regular command

                        this.chatCommands.forEach(commandDefinition => {
                            if (commandDefinition.commandName === command)
                                commandDefinition.commandHandler(
                                    new Classes.ChatCommandParameters(p.playerUid, p.login, params),
                                    this
                                );
                        });
                    }

                    // regular onChat function        
                    plugins.forEach(plugin => { if (typeof plugin.onChat != "undefined") plugin.onChat(p, this) });
                    break;
        
                case 'ManiaPlanet.BeginMap':
                    p = Classes.Map.fromCallback(params);
                    plugins.forEach(plugin => { if (typeof plugin.onBeginMap != "undefined") plugin.onBeginMap(p, this) });
                    break;
        
                case 'ManiaPlanet.BeginMatch':
                    // has no parameters
                    plugins.forEach(plugin => { if (typeof plugin.onBeginMap != "undefined") plugin.onBeginMatch(this) });
                    break;
        
                case 'ManiaPlanet.BillUpdated':
                    p = new CallbackParams.UpdatedBill(params);
                    plugins.forEach(plugin => { if (typeof plugin.onBillUpdate != "undefined") plugin.onBillUpdate(p, this) });
                    break;
        
                case 'ManiaPlanet.EndMap':
                    p = Classes.Map.fromCallback(params);
                    plugins.forEach(plugin => { if (typeof plugin.onEndMap != "undefined") plugin.onEndMap(p, this) });
                    break;
        
                case 'ManiaPlanet.EndMatch':
                    p = new CallbackParams.MatchResults(params);
                    plugins.forEach(plugin => { if (typeof plugin.onEndMatch != "undefined") plugin.onEndMatch(p, this) });
                    break;
        
                case 'ManiaPlanet.MapListModified':
                    p = new CallbackParams.MaplistChange(params);
                    plugins.forEach(plugin => { if (typeof plugin.onMaplistChange != "undefined") plugin.onMaplistChange(p, this) });
                    break;
        
                case 'ManiaPlanet.ModeScriptCallback':
                case 'ManiaPlanet.ModeScriptCallbackArray':
                    p = new CallbackParams.ModeScriptCallback(params);
                    plugins.forEach(plugin => { if (typeof plugin.onModeScriptCallback != "undefined") plugin.onModeScriptCallback(p, this) });
                    break;
        
                case 'ManiaPlanet.PlayerAlliesChanged':
                    p = params[0]; // = player login
                    plugins.forEach(plugin => { if (typeof plugin.onPlayersAlliesChange != "undefined") plugin.onPlayersAlliesChange(p, this) });
                    break;
        
                case 'ManiaPlanet.PlayerInfoChanged':
                    p = new Classes.PlayerInfo(params[0]);
                    plugins.forEach(plugin => { if (typeof plugin.onPlayerInfoChange != "undefined") plugin.onPlayerInfoChange(p, this) });
                    break;
        
                case 'ManiaPlanet.PlayerManialinkPageAnswer':
                    p = new CallbackParams.ManialinkPageAnswer(params);
                    plugins.forEach(plugin => { if (typeof plugin.onManialinkPageAnswer != "undefined") plugin.onManialinkPageAnswer(p, this) });
                    break;
        
                case 'ManiaPlanet.StatusChanged':
                    p = Classes.ServerStatus.fromCallback(params);
                    plugins.forEach(plugin => { if (typeof plugin.onStatusChange != "undefined") plugin.onStatusChange(p, this) });
                    break;
        
                case 'ManiaPlanet.TunnelDataRecieved':
                    p = new CallbackParams.TunnelData(params);
                    plugins.forEach(plugin => { if (typeof plugin.onTunnelDataRecieved != "undefined") plugin.onTunnelDataRecieved(p, this) });
                    break;
        
                case 'ManiaPlanet.VoteUpdated':
                    p = Classes.CallVote.fromCallback(params);
                    plugins.forEach(plugin => { if (typeof plugin.onVoteUpdate != "undefined") plugin.onVoteUpdate(p, this) });
                    break;
        
                case 'TrackMania.PlayerCheckpoint':
                    p = new CallbackParams.PlayerCheckpoint(params);
                    plugins.forEach(plugin => { if (typeof plugin.onCheckpoint != "undefined") plugin.onCheckpoint(p, this) });
                    break;
        
        
                case 'TrackMania.PlayerFinish':
                    p = new CallbackParams.PlayerFinish(params);
                    plugins.forEach(plugin => { if (typeof plugin.onFinish != "undefined") plugin.onFinish(p, this) });
                    break;
        
                case 'TrackMania.PlayerIncoherence':
                    p = new CallbackParams.PlayerIncoherence(params);
                    plugins.forEach(plugin => { if (typeof plugin.onIncoherence != "undefined") plugin.onIncoherence(p, this) });
                    break;
            }
        });
    }

    /**
     * Registers a chat command to be used later
     * @param {Classes.ChatCommand} commandDefinition 
     */
    registerChatCommand(commandDefinition) {

        // no custom admin command allowed
        if (commandDefinition.name == 'admin') { logger('w', `A chat command from plugin ${commandDefinition.pluginName} attempted to register itself as /admin, fix the plugin or contact the plugin's developer.`); return; }            
           
        // faulty command definition
        if (commandDefinition.commandName == undefined || commandDefinition.commandHandler == undefined || commandDefinition.commandDescription == undefined || commandDefinition.commandName == '' || commandDefinition.commandDescription == '') { logger('w', `Chat command ${commandDefinition.toString()} from plugin ${commandDefinition.pluginName} has an invalid command definition lacking name, a handler function or a description, fix the plugin or contact the plugin's developer.`); return; }

        this.chatCommands.push(commandDefinition);
    }

    /**
     * Registers a chat command to be used
     * @param {Classes.ChatCommand} commandDefinition 
     */
    registerAdminCommand(commandDefinition) { }
    
}

let nc = new NextControl();
await nc.onStartup();
await nc.startListening();