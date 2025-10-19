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
import mariadb from 'mariadb';

/**
 * Other imports
 */
import * as CallbackParams from './lib/callbackparams.js';
import * as Classes from './lib/classes.js';
import { format, stripFormatting } from './lib/utilities.js';
import { Logger } from "./lib/logger.js";


import { DatabaseLib } from "./lib/databaseLib.js";
import { ServerLib } from "./lib/serverLib.js";

import { Settings } from './settings.js';
import { Sentences } from './lib/sentences.js';
import { getPluginList } from './plugins.js'
import { TMX } from './lib/tmx.js'
import * as fs from "fs";


const dbtype = Settings.usedDatabase.toLocaleLowerCase();

/**
 * Main class containing the controller's brain
 */
export class NextControl {

    /**
     * Object containing Dictionaries (login => list), to store query results in
     */
    lists = {
        /**
         * List containing an array of PlayerInfos from a previous query. Key is the player login starting a query before.
         * @type {Map<string, Array<Classes.PlayerInfo>>}
         */
        players: undefined,

        /**
         * List containing an array of Maps from a previous query. Key is the player login starting a query before.
         * @type {Map<string, Array<Classes.Map>>}
         */
        maps: undefined
    }

    /**
     * Chat Commands list
     * @type {Array<Classes.ChatCommand>}
     */
    chatCommands

    /**
     * Admin Commands list
     * @type {Array<Classes.ChatCommand>}
     */
    adminCommands

    /**
     * Flag will be set to true, once the class instance is ready for listening.
     * @type {Boolean}
     */
    isReady = false;

    /**
     * Mongodb database object
     * @type {mongodb.Db}
     */
    mongoDb

    /**
     * MariaDB database connection object
     * @type {mariadb.PoolConnection}
     */
    mysql

    /**
     * DatabaseLib object
     * @type {DatabaseLib}
     */
    dblib

    /**
     * ServerLib objekt
     * @type {ServerLib}
     */
    serverlib

    /**
     * Controller for the gamemode settings
     * @type {Classes.ModeSettingsController}
     */
    modeSettings

    /**
     * List of required collections that need to exist in the MongoDB database
     * @type {Array<String>}
     */
    requiredCollections = []

    /**
     * Do not instatiate this class yourself (unless you know what you're doing ;-)), the only existing object should be passed around by the object itself!
     */
    constructor () {
        this.lists.players = new Map();
        this.lists.maps = new Map();
     }

    /**
     * Prepares NextControl to be ready for use
     */
    async startup() {
        Logger.startup('Starting NextControl...');

        // create Trackmania XML-RPC client
        let client = gbxremote.createClient(Settings.trackmania.port);

        let serverPromise = new Promise((resolve, reject) => {
            // check for error
            client.on('error', () => {
                Logger.error('Could not connect to server. Check your settings!');
                process.exit(1);
            })

            // upon connection
            client.on('connect', async () => {
                // set API version
                // await client.query('SetApiVersion', ['2023-03-24']).catch(() => {
                //     // Logger.error('Setting API version failed.');
                //     // process.exit(2);
                // });

                // authenticate as SuperAdmin
                await client.query('Authenticate', [Settings.trackmania.login, Settings.trackmania.password]).catch(() => {
                    Logger.error('Authentication failed -- check credentials!');
                    process.exit(3);
                });

                // enable callbacks
                await client.query('EnableCallbacks', [true]).catch(() => {
                    Logger.error('Enabling callbacks failed.');
                    process.exit(4);
                });

                // enable script callbacks
                await client.query('TriggerModeScriptEventArray', ['XmlRpc.EnableCallbacks', ['true']]).catch(() => {
                    Logger.error('Enabling script callbacks failed.');
                    process.exit(5);
                });

                // and "return" the functioning client object
                resolve(client);
            });
        });

        // wait for promise
        await serverPromise.catch(e => {
            Logger.error('Connecting to the server has failed. Check port.');
            process.exit(6);
        });

        Logger.startup('Connected to Trackmania Server');

        // set properties accordingly
        this.client = client;

        // woo, we're connected!
        await this.client.query('ChatSendServerMessage', ['$0f0~~ $fffStarting NextControl ...']);

        if (dbtype === 'mongodb') {
            // create MongoDB client
            let database = new mongodb.MongoClient(Settings.mongoDb.uri, { useNewUrlParser: true, useUnifiedTopology: true });

            // wait for database connection
            await database.connect().catch(e => {
                Logger.error(JSON.stringify(e, null, 2));
                process.exit(7);
            });

            // set properties accordingly
            this.mongoDb = await database.db(Settings.mongoDb.database)

        } else if (dbtype === "mysql") {

            // create connection pool
            let pool = await mariadb.createPool(Settings.mySql);

            // create actual connection
            let conn = await pool.getConnection().catch(e => {
                Logger.error(JSON.stringify(e, null, 2));
                process.exit(7);
            });

            // set properties accordingly
            this.mysql = conn;
        }


        // set up helper libraries
        this.serverlib = new ServerLib(this);
        this.dblib = new DatabaseLib(this);

        // woo, we're connected!
        Logger.startup('Connected to Database Server');
        await this.client.query('ChatSendServerMessage', ['$0f0~~ $fffConnected to database ...']);

        // set up necessary collections or tables
        if (dbtype === "mongodb") await this.dblib.mongodbCheckCollections();
        if (dbtype === "mysql") await this.dblib.mysqlCheckTables();

        // ensure ./settings/ exists for our plugins
        if (!fs.existsSync('./settings'))
            fs.mkdirSync('./settings');

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
        Logger.startup('Plugins loaded: ' + pluginList);

        // log commands
        let commandList = '';
        this.chatCommands.forEach((command, idx) => {
            if (idx < this.chatCommands.length - 1)
                commandList += command.commandName + ', '; else commandList += command.commandName
        })
        Logger.startup('Chat commands registered: ' + commandList);

        // log admin commands
        let adminCList = '';
        this.adminCommands.forEach((command, idx) => {
            if (idx < this.adminCommands.length - 1)
                adminCList += command.commandName + ', '; else adminCList += command.commandName
        })
        Logger.startup('Admin commands registered: ' + adminCList);


        // now that we're done:
        this.isReady = true;
        Logger.info('Startup completed, starting to listen');
        await this.client.query('ChatSendServerMessage', ['$0f0~~ $fffUp and running!']);

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

        // initialize jukebox
        this.jukebox = new Classes.Jukebox();

        // initialize mode settings controller
        this.modeSettings = new Classes.ModeSettingsController(this);
        await this.modeSettings.init();
        
        // start actually listening
        this.client.on('callback', async (method, para) => {
            let p;

            // we need to catch callbacks from the gamemode script beforehand, to properly get along with them
            if (method === 'TrackMania.ModeScriptCallbackArray') {
                method = para.shift();
                p = JSON.parse(para[0][0]);
            }

            // console.log({method: method, para: para}, null, 2);

            if (method === 'Trackmania.Event.WayPoint') {
                p = new Classes.WaypointInfo(p);

                this.plugins.forEach(plugin => { if (typeof plugin.onWaypoint != "undefined") plugin.onWaypoint(p); })

            } else if (method === 'TrackMania.PlayerConnect') {
                let login = String(para[0]);
                p = new Classes.PlayerInfo(await this.client.query('GetPlayerInfo', [login, 1]));

                // add player to status
                this.status.addPlayer(p);

                //get variables right for handlers
                let isSpectator = Boolean(para[1]);

                // start player connect handlers
                this.plugins.forEach(plugin => { if (typeof plugin.onPlayerConnect != "undefined")  plugin.onPlayerConnect(p, isSpectator) });

            } else if (method === 'TrackMania.PlayerDisconnect') {
                let player = this.status.getPlayer(String(para[0])), //<- playerInfo
                    reason = String(para[1]);

                // clear temporarily stored lists for the leaving player
                Object.keys(this.lists).forEach(key => {
                    if (this.lists[key].has(player.login)) this.lists[key].delete(player.login);
                });

                // start player disconnect handlers
                this.plugins.forEach(plugin => { if (typeof plugin.onPlayerDisconnect != "undefined")  plugin.onPlayerDisconnect(player, reason) });

                // remove player from status
                this.status.removePlayer(player.login);

            } else if (method === 'TrackMania.PlayerChat') {
                let login = String(para[1]),
                    text = String(para[2]),
                    isCommand = Boolean(para[3]);

                // chat command handling
                if (isCommand) {

                    let splitCommand = text.substring(text.charAt(1)=='/'?2:1).split(' '),
                        command = splitCommand.shift(),
                        params = splitCommand.join(' '),
                        player = this.status.getPlayer(login);


                    if (command == 'admin' || text.charAt(1) == '/') {
                        // handle admin command, command is "first" parameter

                        if (!Settings.admins.includes(login)) {
                            // player is not admin!
                            Logger.info(login + ' tried using command /admin ' + adminCommand + ', but is no admin!');
                            this.client.query('ChatSendServerMessageToLogin', [Sentences.playerNotAdmin, login]);
                        }

                        var splitAdminCommand,adminCommand,adminParams;
                        
                        if (command =='admin'){
                            splitAdminCommand = params.split(' ');
                            adminCommand = splitAdminCommand.shift();
                            adminParams = splitAdminCommand;
                        } else if (text.charAt(1) == '/'){
                            splitAdminCommand = params.split(' ');
                            adminCommand = command;
                            adminParams = splitAdminCommand;
                        }

                        Logger.info(stripFormatting(player.name) + ' used admin command ' + adminCommand + ' with parameters: ' + adminParams);

                        this.adminCommands.forEach(commandDefinition => {
                            if (commandDefinition.commandName === adminCommand) {
                                this.plugins.forEach(plugin => {
                                    if (plugin.name == commandDefinition.pluginName) {
                                        try {
                                            plugin[commandDefinition.commandHandler.name](login, adminParams);
                                        } catch (err) {
                                            Logger.error("Error occured handling command: " + err);
                                        }
                                    }
                                })
                            }
                        });
                    }
                    
                    else {
                        // handle regular command
                        Logger.info(stripFormatting(player.name) + ' used command /' + command + ' with parameters: ' + params);

                        this.chatCommands.forEach(commandDefinition => {
                            if (commandDefinition.commandName === command) {
                                this.plugins.forEach(plugin => {
                                    if (plugin.name == commandDefinition.pluginName) {
                                        try {
                                            plugin[commandDefinition.commandHandler.name](login, splitCommand);
                                        } catch (err){
                                            Logger.error("Error occured handling command: " + err);
                                        }
                                    }
                                })
                            }
                        });
                    }
                }

                // regular onChat function        
                this.plugins.forEach(plugin => { if (typeof plugin.onChat != "undefined") plugin.onChat(login, text) });

            } else if (method === 'TrackMania.BeginMap') {
                // parse map object
                p = new Classes.Map(para[0]);

                /**
                 * copy of the Map object as given by server
                 * @type {Classes.Map}
                 */
                let servMap = JSON.parse(JSON.stringify(p));

                // check if map is in database already
                if (dbtype === 'mongodb') {
                    if ((await this.mongoDb.collection('maps').countDocuments({uid : p.uid})) > 0)
                        p = Classes.Map.fromDb(await this.mongoDb.collection('maps').findOne({uid : p.uid}));

                    else { // map isn't in database yet:
                        // find TMX id
                        p.setTMXId(await TMX.getID(p.uid));

                        // update database entry
                        await this.mongoDb.collection('maps').insertOne(p);
                    }
                } else if (dbtype === 'mysql') {
                    this.mysql.query('SELECT * FROM maps WHERE uid = ?', p.uid).then(async rows => {
                        if (rows.length > 0) 
                            p = Classes.Map.fromDb(rows[0]);
                        else { // map isn't in database yet:
                            // find TMX id
                            p.setTMXId(await TMX.getID(p.uid));

                            // update database entry
                            this.mysql.query('INSERT INTO maps VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                                p.uid,
                                p.name,
                                p.file,
                                p.author,
                                p.mood,
                                p.medals,
                                p.coppers,
                                p.isMultilap,
                                p.nbLaps,
                                p.nbCheckpoints,
                                p.type,
                                p.style,
                                p.tmxid
                            ]).catch(err => {
                                Logger.error(err)
                            });
                        }
                    }).catch(err => {
                        Logger.error(err)
                    });
                }

                let hasChanged = false;

                // check if the map has a set TMX ID
                if (p.tmxid === -1) {
                    p.setTMXId(await TMX.getID(p.uid));
                    hasChanged = true;
                }

                // check if the map has a set Checkpoint number
                if (p.nbCheckpoints === -1) {
                    p.nbCheckpoints = servMap.nbCheckpoints;
                    hasChanged = true;
                }

                // check if the map has a set Lap number
                if (p.nbLaps === -1) {
                    p.nbLaps = servMap.nbLaps;
                    hasChanged = true;
                }

                // update the map document in database, if we have just changed it
                if (dbtype === 'mongodb') {
                    if (hasChanged) await this.mongoDb.collection('maps').updateOne({uid: p.uid}, {$set: p})
                } else if (dbtype === 'mysql') {
                    if (hasChanged) this.mysql.query('UPDATE maps SET name=?,file=?,author=?,mood=?,medals=?,coppers=?,isMultilap=?,nbLaps=?,nbCheckpoints=?,type=?,style=?,tmxid=? WHERE uid = ?', [
                        p.name,
                        p.file,
                        p.author,
                        p.mood,
                        p.medals,
                        p.coppers,
                        p.isMultilap,
                        p.nbLaps,
                        p.nbCheckpoints,
                        p.type,
                        p.style == undefined ? "" : p.style, // It's common that the style is undefined, so we need to check for that and add an empty string if it's undefined
                        p.tmxid,
                        p.uid
                    ]);
                }

                // update status:
                this.status.map = p;

                this.plugins.forEach(plugin => { if (typeof plugin.onBeginMap != "undefined") plugin.onBeginMap(p) });

            } else if (method === 'TrackMania.BeginMatch') {
                // has no parameters
                this.plugins.forEach(plugin => { if (typeof plugin.onBeginMatch != "undefined") plugin.onBeginMatch() });

            } else if (method === 'TrackMania.BillUpdated') {
                p = new CallbackParams.UpdatedBill(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onBillUpdate != "undefined") plugin.onBillUpdate(p) });

            } else if (method === 'TrackMania.EndMap') {
                p = new Classes.Map(para[0]);
                this.plugins.forEach(plugin => { if (typeof plugin.onEndMap != "undefined") plugin.onEndMap(p) });

            } else if (method === 'TrackMania.EndMatch') {
                p = new CallbackParams.MatchResults(para);

                // reset mode settings to default
                await this.modeSettings.resetSettings();

                this.plugins.forEach(plugin => { if (typeof plugin.onEndMatch != "undefined") plugin.onEndMatch(p) });

            } else if (method === 'TrackMania.MapListModified') {
                p = new CallbackParams.MaplistChange(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onMaplistChange != "undefined") plugin.onMaplistChange(p) });

            } else if (method === 'TrackMania.PlayerAlliesChanged') {
                p = para[0]; // = player login
                this.plugins.forEach(plugin => { if (typeof plugin.onPlayersAlliesChange != "undefined") plugin.onPlayersAlliesChange(p) });

            } else if (method === 'TrackMania.PlayerInfoChanged') {
                p = new Classes.PlayerInfo(para[0]);
                this.plugins.forEach(plugin => { if (typeof plugin.onPlayerInfoChange != "undefined") plugin.onPlayerInfoChange(p) });

            } else if (method === 'TrackMania.PlayerManialinkPageAnswer') {
                p = new CallbackParams.ManialinkPageAnswer(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onManialinkPageAnswer != "undefined") plugin.onManialinkPageAnswer(p) });

            } else if (method === 'TrackMania.StatusChanged') {
                p = Classes.ServerStatus.fromCallback(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onStatusChange != "undefined") plugin.onStatusChange(p) });

            } else if (method === 'TrackMania.TunnelDataReceived') {
                p = new CallbackParams.TunnelData(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onTunnelDataRecieved != "undefined") plugin.onTunnelDataRecieved(p) });

            } else if (method === 'TrackMania.VoteUpdated') {
                p = Classes.CallVote.fromCallback(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onVoteUpdate != "undefined") plugin.onVoteUpdate(p) });

            } else if (method === 'TrackMania.PlayerIncoherence') {
                p = new CallbackParams.PlayerIncoherence(para);
                this.plugins.forEach(plugin => { if (typeof plugin.onIncoherence != "undefined") plugin.onIncoherence(p) });
    
            }
        });
    }

    /**
     * Registers a chat command to be used later
     * @param {Classes.ChatCommand} comm 
     */
    registerChatCommand(comm) {

        // no custom admin command allowed
        if (comm.name == 'admin') { Logger.warning(`A chat command from plugin ${comm.pluginName} attempted to register itself as /admin, fix the plugin or contact the plugin's developer.`); return; }            
           
        // faulty command definition
        if (comm.commandName == undefined || comm.commandHandler == undefined || comm.commandDescription == undefined || comm.commandName == '' || comm.commandDescription == '') { Logger.warning(`Chat command ${comm.toString()} from plugin ${comm.pluginName} has an invalid command definition lacking name, a handler function or a description, fix the plugin or contact the plugin's developer.`); return; }

        this.chatCommands.push(comm);
    }

    /**
     * Registers a chat command to be used
     * @param {Classes.ChatCommand} comm 
     */
    registerAdminCommand(comm) { 

        // faulty command definition
        if (comm.commandName == undefined || comm.commandHandler == undefined || comm.commandDescription == undefined || comm.commandName == '' || comm.commandDescription == '') { Logger.warning(`Chat command ${comm.toString()} from plugin ${comm.pluginName} has an invalid command definition lacking name, a handler function or a description, fix the plugin or contact the plugin's developer.`); return; }

        this.adminCommands.push(comm);
        
    }

    /**
     * Registers a collection as required to exist for startup checks
     * @param {String} collection
     */
    addRequiredCollection(collection) {
        if (!this.requiredCollections.includes(collection))
            this.requiredCollections.push(collection);
    }

}

// actually executed code
let nc = new NextControl();
await nc.startup();