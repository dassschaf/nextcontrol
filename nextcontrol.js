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
import beautify from 'json-beautify';

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
import { getPluginList } from './plugins.js'
import { TMX } from './lib/tmx.js'


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
    async startup() {
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
                if (!(await client.query('TriggerModeScriptEventArray', ['XmlRpc.EnableCallbacks', ['true']]))) reject('script');

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
        this.clientWrapper.chatSendServerMessage('Connected to database ...');

        // now lets load plugins:
        this.chatCommands = [];
        this.adminCommands = [];
        this.plugins = getPluginList(this);

        // log plugins
        let pluginList = "";
        this.plugins.forEach((plugin, idx) => { 
            if (idx < this.plugins.length - 1) 
                pluginList += plugin.name + ', '; else pluginList += plugin.name 
        });
        logger('su', 'Plugins loaded: ' + pluginList);

        // log commands
        let commandList = '';
        this.chatCommands.forEach((command, idx) => {
            if (idx < this.chatCommands.length - 1)
                commandList += command.commandName + ', '; else commandList += command.commandName
        })
        logger('su', 'Chat commands registered: ' + commandList);

        // log admin commands
        let adminCList = '';
        this.adminCommands.forEach((command, idx) => {
            if (idx < this.adminCommands.length - 1)
                adminCList += command.commandName + ', '; else adminCList += command.commandName
        })
        logger('su', 'Admin commands registered: ' + adminCList);

        // now that we're done:
        this.isReady = true;
        logger('i', 'Startup completed, starting to listen');
        this.clientWrapper.chatSendServerMessage('Up and running!')

        this.startListening();
    }

    /**
     * Function, to start listening to the server and dealing with the server's callbacks
     */
    async startListening() {
        if (!this.isReady) return false

        // initialize status object
        this.status = new Classes.Status();
        await this.status.init(this);
        
        // start actually listening
        this.client.on('callback', async (method, para) => {
            let p;

            // we need to catch callbacks from the gamemode script beforehand, to properly get along with them
            if (method === 'ManiaPlanet.ModeScriptCallbackArray') {
                method = para.shift();
                p = JSON.parse(para[0][0]);
            }

            //console.log(JSON.stringify({method: method, para: para}, null, 2));

            if (method === 'Trackmania.Event.WayPoint') {
                p = new Classes.WaypointInfo(p);

                this.plugins.forEach(plugin => { if (typeof plugin.onWaypoint != "undefined") plugin.onWaypoint(p, this); })

            } else if (method === 'ManiaPlanet.PlayerConnect') {
                login = String(para[0]);
                p = new Classes.PlayerInfo(await this.client.query('GetPlayerInfo', [login, 1]));

                // add player to status
                this.status.addPlayer(p);

                //get variables right for handlers
                let isSpectator = Boolean(para[1]);

                // start player connect handlers
                this.plugins.forEach(plugin => { if (typeof plugin.onPlayerConnect != "undefined")  plugin.onPlayerConnect(p, isSpectator, this) });

            } else if (method === 'ManiaPlanet.PlayerDisconnect') {
                let player = this.status.getPlayer(String(para[0])),
                    reason = String(para[1]);
                // start player disconnect handlers
                this.plugins.forEach(plugin => { if (typeof plugin.onPlayerDisconnect != "undefined")  plugin.onPlayerDisconnect(player, reason, this) });

                // remove player from status
                this.status.removePlayer(p.login);

            } else if (method === 'ManiaPlanet.PlayerChat') {
                let login = String(para[1]),
                    text = String(para[2]),
                    isCommand = Boolean(para[3]);

                // chat command handling
                if (isCommand) {

                    let splitCommand = text.split('/')[1].split(' '),
                        command = splitCommand.shift(),
                        params = splitCommand.join(' ');


                    if (command == 'admin') {
                        // handle admin command, command is "first" parameter

                        if (!Settings.admins.includes(login)) {
                            // player is not admin!
                            logger('r', login + ' tried using admin command /' + adminCommand + ', but is no admin!');
                            this.clientWrapper.chatSendServerMessageToLogin(Sentences.playerNotAdmin, login);
                        }
                        
                        let splitAdminCommand = params.split(' '),
                            adminCommand = splitAdminCommand.shift(),
                            adminParams = splitAdminCommand.join(' ');

                        logger('r', login + ' used admin command /' + adminCommand + ' with parameters: ' + adminParams);

                        this.adminCommands.forEach(commandDefinition => {
                            if (commandDefinition.commandName === adminCommand) 
                                commandDefinition.commandHandler(
                                    login, adminParams,
                                    this
                                );
                        });
                    }
                    
                    else {
                        // handle regular command
                        logger('r', login + ' used command /' + command + ' with parameters: ' + params);

                        this.chatCommands.forEach(commandDefinition => {
                            if (commandDefinition.commandName === command)
                                commandDefinition.commandHandler(
                                    login, params,
                                    this
                                );
                        });
                    }
                }

                // regular onChat function        
                this.plugins.forEach(plugin => { if (typeof plugin.onChat != "undefined") plugin.onChat(login, text, this) });

            } else if (method === 'ManiaPlanet.BeginMap') {
                p = Classes.Map.fromCallback(para);

                if ((await this.database.collection('maps').countDocuments({uid : p.uid})) > 0)
                    p = await this.database.collection('maps').findOne({uid : p.uid});

                else {
                    // find TMX id
                    p.setTMXId(await TMX.getID(p.uid));

                    // update database entry
                    await this.database.collection('maps').insertOne(p);
                }

                // update status:
                this.status.map = p;

                this.plugins.forEach(plugin => { if (typeof plugin.onBeginMap != "undefined") plugin.onBeginMap(p, this) });

            } else if (method === 'ManiaPlanet.BeginMatch') {
                // has no parameters
                this.plugins.forEach(plugin => { if (typeof plugin.onBeginMatch != "undefined") plugin.onBeginMatch(this) });

            } else if (method === 'ManiaPlanet.BillUpdated') {
                p = new CallbackParams.UpdatedBill(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onBillUpdate != "undefined") plugin.onBillUpdate(p, this) });

            } else if (method === 'ManiaPlanet.EndMap') {
                p = Classes.Map.fromCallback(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onEndMap != "undefined") plugin.onEndMap(p, this) });

            } else if (method === 'ManiaPlanet.EndMatch') {
                p = new CallbackParams.MatchResults(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onEndMatch != "undefined") plugin.onEndMatch(p, this) });

            } else if (method === 'ManiaPlanet.MapListModified') {
                p = new CallbackParams.MaplistChange(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onMaplistChange != "undefined") plugin.onMaplistChange(p, this) });

            } else if (method === 'ManiaPlanet.PlayerAlliesChanged') {
                p = para[0]; // = player login
                this.plugins.forEach(plugin => { if (typeof plugin.onPlayersAlliesChange != "undefined") plugin.onPlayersAlliesChange(p, this) });

            } else if (method === 'ManiaPlanet.PlayerInfoChanged') {
                p = new Classes.PlayerInfo(para[0]);
                this.plugins.forEach(plugin => { if (typeof plugin.onPlayerInfoChange != "undefined") plugin.onPlayerInfoChange(p, this) });

            } else if (method === 'ManiaPlanet.PlayerManialinkPageAnswer') {
                p = new CallbackParams.ManialinkPageAnswer(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onManialinkPageAnswer != "undefined") plugin.onManialinkPageAnswer(p, this) });

            } else if (method === 'ManiaPlanet.StatusChanged') {
                p = Classes.ServerStatus.fromCallback(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onStatusChange != "undefined") plugin.onStatusChange(p, this) });

            } else if (method === 'ManiaPlanet.TunnelDataRecieved') {
                p = new CallbackParams.TunnelData(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onTunnelDataRecieved != "undefined") plugin.onTunnelDataRecieved(p, this) });

            } else if (method === 'ManiaPlanet.VoteUpdated') {
                p = Classes.CallVote.fromCallback(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onVoteUpdate != "undefined") plugin.onVoteUpdate(p, this) });

            } else if (method === 'TrackMania.PlayerIncoherence') {
                p = new CallbackParams.PlayerIncoherence(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onIncoherence != "undefined") plugin.onIncoherence(p, this) });
    
            }
        });
    }

    /**
     * Registers a chat command to be used later
     * @param {Classes.ChatCommand} comm 
     */
    registerChatCommand(comm) {

        // no custom admin command allowed
        if (comm.name == 'admin') { logger('w', `A chat command from plugin ${comm.pluginName} attempted to register itself as /admin, fix the plugin or contact the plugin's developer.`); return; }            
           
        // faulty command definition
        if (comm.commandName == undefined || comm.commandHandler == undefined || comm.commandDescription == undefined || comm.commandName == '' || comm.commandDescription == '') { logger('w', `Chat command ${comm.toString()} from plugin ${comm.pluginName} has an invalid command definition lacking name, a handler function or a description, fix the plugin or contact the plugin's developer.`); return; }

        this.chatCommands.push(comm);
    }

    /**
     * Registers a chat command to be used
     * @param {Classes.ChatCommand} comm 
     */
    registerAdminCommand(comm) { 

        // faulty command definition
        if (comm.commandName == undefined || comm.commandHandler == undefined || comm.commandDescription == undefined || comm.commandName == '' || comm.commandDescription == '') { logger('w', `Chat command ${comm.toString()} from plugin ${comm.pluginName} has an invalid command definition lacking name, a handler function or a description, fix the plugin or contact the plugin's developer.`); return; }

        this.adminCommands.push(comm);
        
    }

}

let nc = new NextControl();
await nc.startup();