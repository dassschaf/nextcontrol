/*
 * NextControl 
 * Trackmania 2&2020 dedicated server controller
 */

import { logger } from './lib/utilities.mjs';
logger('su', 'Starting NextControl...');

// import npm packages
import gbxremote from 'gbxremote';
import mongodb from 'mongodb';

// import own stuff
import * as CallbackParams from './lib/callbackparams.mjs';
import { ClientWrapper } from './lib/clientwrapper.mjs';
import { DatabaseWrapper } from './lib/dbwrapper.mjs';
import { Settings } from './settings.mjs';
import { Sentences } from './lib/sentences.mjs';

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
import { getPluginList } from './plugins.mjs';
let plugins = getPluginList({ client: _client, database: _database });

// print loaded plugins:
let pluginList = "";
plugins.forEach((plugin, idx) => { if (idx < plugins.length - 1) pluginList += plugin.name + ', '; else pluginList += plugin.name });
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

            plugins.forEach(plugin => { if (typeof plugin.onChat != "undefined") plugin.onChat(p) });
            break;

        case 'ManiaPlanet.BeginMap':

        case 'ManiaPlanet.BeginMatch':

        case 'ManiaPlanet.BillUpdated':

        case 'ManiaPlanet.EndMap':

        case 'ManiaPlanet.MapListModified':

        case 'ManiaPlanet.ModeScriptCallback':

        case 'ManiaPlanet.ModeScriptCallbackArray':

        case 'ManiaPlanet.PlayerAlliesChanged':

        case 'ManiaPlanet.PlayerInfoChanged':

        case 'ManiaPlanet.PlayerManilinkPageAnswer':

        case 'ManiaPlanet.ServerStart':

        case 'ManiaPlanet.ServerStop':

        case 'ManiaPlanet.StatusChanged':

        case 'ManiaPlanet.TunnelDataRecieved':

        case 'ManiaPlanet.VoteUpdated':

        case 'TrackMania.PlayerCheckpoint':

        case 'TrackMania.PlayerFinish':

        case 'PlayerIncoherence':
            break;
    }
})
