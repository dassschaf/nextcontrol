const Settings = {

    // Trackmania server settings
    trackmania: {

        // the server *has* to run on localhost!

        // server port
        port: 5555,

        // Authentication details for SuperAdmin access
        login: 'SuperAdmin',
        password: 'SuperAdmin',

        // Game: TM2020 or TM2
        game: 'TM2020',

        // The login of the server at the master server, look it up on the player page in doubt
        server_login: 'blah',

        // The path to the matchsettings file the server is started with (relative to the UserData directory)
        matchsettings_file: 'set.txt'
    },

    usedDatabase: 'mongodb', // or mysql...

    // you only need to enter the details about the database you actually are going to use.

    // MongoDB settings
    mongoDb: {
        // Connection URI
        uri: "mongodb://localhost/?poolSize=20&w=majority",

        // Database name
        database: 'nextcontrol'
    },

    // MySQL database settings
    mySql: {
        // host and port
        host: "localhost",
        port: 3306,

        // user and password
        user: "root",
        password: "password",

        // database name
        database: "nextcontrol"
    },

    // List of disabled plugins by their name
    disabledPlugins: ['Sample Plugin'],

    // List of administrators by their logins
    admins: [
        'your login here'
    ],

    // If you're using Discord integration plugin, set your settings here
    // If you don't want to use Discord, set "Discord Bot Integration" in the disabledPlugins array
    discord: {
        // Token of your Discord Bot, grab it at https://discord.com/developers
        token: "super-secret-token",

        // Logging channel ID, logs anything from the server so it's not meant for everyone.
        // Leave an empty field ( "" ) if you don't want to enable logs
        logChannel: "0123456789",

        // Enables or disable chat logging to Discord, if enabled all messages sent in TM will be logged on the log Channel set above
        logChat: true,

        // Cross-chat channel ID, Allows to link together the server chat and the Discord chat.
        // The messages received on Discord will be sent on TM and vice versa
        // Leave an empty field ( "" ) if you don't want to enable cross-chat
        chatChannel: "0123456789"
    }

}

export { Settings }