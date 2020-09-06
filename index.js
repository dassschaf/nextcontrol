/*
 * NextControl 
 * Trackmania 2&2020 dedicated server controller
 */

import { logger } from './lib/utilities.js';
logger('su', 'Starting NextControl...');

// import npm packages
import gbxremote from 'gbxremote';
import mongodb from 'mongodb';

// import own stuff
import * as CallbackParams from './lib/callbackparams.js';
import * as Classes from './lib/classes.js';
import { ClientWrapper } from './lib/clientwrapper.js';
import { DatabaseWrapper } from './lib/dbwrapper.js';
import { Settings } from './settings.js';
import { Sentences } from './lib/sentences.js';

logger('su', 'Packages imported');

// starting up NextControl
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
let _client = new ClientWrapper(await serverPromise);
logger('su', 'Connected to Trackmania Server');
_client.chatSendServerMessage('Starting NextControl ...');

// create MongoDB client
let database = new mongodb.MongoClient(Settings.database.uri, { useNewUrlParser: true, useUnifiedTopology: true });
await database.connect();

let _database = new DatabaseWrapper(await database.db(Settings.database.database));
logger('su', 'Connected to MongoDB Server');
_client.chatSendServerMessage('Connected to database ...');

// read plugins
import { getPluginList } from './plugins.js';
let plugins = getPluginList(new Classes.WrapperList(_client, _database));

// print loaded plugins:
let pluginList = "";
plugins.forEach((plugin, idx) => { 
    if (idx < plugins.length - 1) 
        pluginList += plugin.name + ', '; else pluginList += plugin.name 
});
logger('su', 'Plugins loaded: ' + pluginList);

// startup done, lets start waiting for the server:
logger('i', 'Startup completed, starting to listen');
_client.chatSendServerMessage('Up and running!')

client.on('callback', async (method, params) => {
    let p;
    switch (method) {
        case 'ManiaPlanet.PlayerConnect':
            p = new CallbackParams.PlayerConnect(params);
            plugins.forEach(plugin => { if (typeof plugin.onPlayerConnect != "undefined")  plugin.onPlayerConnect(p) });
            break;

        case 'ManiaPlanet.PlayerDisconnect':
            p = new CallbackParams.PlayerDisconnect(params);
            plugins.forEach(plugin => { if (typeof plugin.onPlayerDisconnect != "undefined")  plugin.onPlayerDisconnect(p) });
            break;

        case 'ManiaPlanet.PlayerChat':
            p = new CallbackParams.ChatMessage(params);

            if (p.text == '/shutdown' && Settings.admins.includes(p.login)) { await _client.chatSendServerMessage(Sentences.shuttingDown); logger('w', 'Shutting down after admin invoked "/shutdown" command'); process.exit(0); }
            if (p.text == '/logline' && Settings.admins.includes(p.login))  logger('-----------');

            plugins.forEach(plugin => { if (typeof plugin.onChat != "undefined") plugin.onChat(p) });
            break;

        case 'ManiaPlanet.BeginMap':
            p = Classes.Map.fromCallback(params);
            plugins.forEach(plugin => { if (typeof plugin.onBeginMap != "undefined") plugin.onBeginMap(p) });
            break;

        case 'ManiaPlanet.BeginMatch':
            // has no parameters
            plugins.forEach(plugin => { if (typeof plugin.onBeginMap != "undefined") plugin.onBeginMatch() });
            break;

        case 'ManiaPlanet.BillUpdated':
            p = new CallbackParams.UpdatedBill(params);
            plugins.forEach(plugin => { if (typeof plugin.onBillUpdate != "undefined") plugin.onBillUpdate(p) });
            break;

        case 'ManiaPlanet.EndMap':
            p = Classes.Map.fromCallback(params);
            plugins.forEach(plugin => { if (typeof plugin.onEndMap != "undefined") plugin.onEndMap(p) });
            break;

        case 'ManiaPlanet.EndMatch':
            p = new CallbackParams.MatchResults(params);
            plugins.forEach(plugin => { if (typeof plugin.onEndMatch != "undefined") plugin.onEndMatch(p) });
            break;

        case 'ManiaPlanet.MapListModified':
            p = new CallbackParams.MaplistChange(params);
            plugins.forEach(plugin => { if (typeof plugin.onMaplistChange != "undefined") plugin.onMaplistChange(p) });
            break;

        case 'ManiaPlanet.ModeScriptCallback':
        case 'ManiaPlanet.ModeScriptCallbackArray':
            p = new CallbackParams.ModeScriptCallback(params);
            plugins.forEach(plugin => { if (typeof plugin.onModeScriptCallback != "undefined") plugin.onModeScriptCallback(p) });
            break;

        case 'ManiaPlanet.PlayerAlliesChanged':
            p = params[0]; // = player login
            plugins.forEach(plugin => { if (typeof plugin.onPlayersAlliesChange != "undefined") plugin.onPlayersAlliesChange(p) });
            break;

        case 'ManiaPlanet.PlayerInfoChanged':
            p = new Classes.PlayerInfo(params[0]);
            plugins.forEach(plugin => { if (typeof plugin.onPlayerInfoChange != "undefined") plugin.onPlayerInfoChange(p) });
            break;

        case 'ManiaPlanet.PlayerManialinkPageAnswer':
            p = new CallbackParams.ManialinkPageAnswer(params);
            plugins.forEach(plugin => { if (typeof plugin.onManialinkPageAnswer != "undefined") plugin.onManialinkPageAnswer(p) });
            break;

        case 'ManiaPlanet.StatusChanged':
            p = Classes.ServerStatus.fromCallback(params);
            plugins.forEach(plugin => { if (typeof plugin.onStatusChange != "undefined") plugin.onStatusChange(p) });
            break;

        case 'ManiaPlanet.TunnelDataRecieved':
            p = new CallbackParams.TunnelData(params);
            plugins.forEach(plugin => { if (typeof plugin.onTunnelDataRecieved != "undefined") plugin.onTunnelDataRecieved(p) });
            break;

        case 'ManiaPlanet.VoteUpdated':
            p = Classes.CallVote.fromCallback(params);
            plugins.forEach(plugin => { if (typeof plugin.onVoteUpdate != "undefined") plugin.onVoteUpdate(p) });
            break;

        case 'TrackMania.PlayerCheckpoint':
            p = new CallbackParams.PlayerCheckpoint(params);
            plugins.forEach(plugin => { if (typeof plugin.onCheckpoint != "undefined") plugin.onCheckpoint(p) });
            break;


        case 'TrackMania.PlayerFinish':
            p = new CallbackParams.PlayerFinish(params);
            plugins.forEach(plugin => { if (typeof plugin.onFinish != "undefined") plugin.onFinish(p) });
            break;

        case 'TrackMania.PlayerIncoherence':
            p = new CallbackParams.PlayerIncoherence(params);
            plugins.forEach(plugin => { if (typeof plugin.onIncoherence != "undefined") plugin.onIncoherence(p) });
            break;
    }
})
