/*
 * NextControl 
 * Trackmania 2&2020 dedicated server controller
 */

// import npm packages
import gbxremote from 'gbxremote';
import mongodb from 'mongodb';

// import own libraries
import * as CallbackParams from './lib/callbackparams.mjs';
import { ClientWrapper } from './lib/clientwrapper.mjs';
import { DatabaseWrapper } from './lib/dbwrapper.mjs';
import { getPluginList } from './plugins.mjs';
import { log } from './lib/utilities.mjs';
import { Settings } from './Settings.mjs';

// starting up NextControl
log('su', 'Starting NextControl...');

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
log('su', 'Connected to Trackmania Server');
_client.chatSendServerMessage('Starting NextControl ...');

// create MongoDB client
let database = new mongodb.MongoClient(Settings.database.uri, { useNewUrlParser: true, useUnifiedTopology: true });
await database.connect();
let _database = new DatabaseWrapper(database);
log('su', 'Connected to MongoDB Server');
_client.chatSendServerMessage('Connected to database ...');

// read plugins
let plugins = getPluginList({ client: _client, database: _database });

// startup done, lets start waiting for the server:
log('i', 'Startup completed, starting to listen');

client.on('callback', (method, params) => {
    switch (method) {
        case 'ManiaPlanet.PlayerConnect':
            let p = CallbackParams.PlayerConnect(params);
            plugins.forEach(plugin => { plugin.onPlayerConnect(p) });
            break;
    }
})
