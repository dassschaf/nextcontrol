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

        // The matchsettings file the server is started with
        matchsettings_file: 'set.txt'
    },

    // Database settings
    database: {
        // Database server host or URI
        uri: "mongodb://localhost/?poolSize=20&w=majority",

        // Database name
        database: 'nextcontrol',

        // Database type
        // Supported Databases: 'MongoDB', ... more to come.
        type: "MongoDB"
    },

    // List of disabled plugins by their name
    disabledPlugins: ['Sample Plugin'],

    // List of administrators by their logins
    admins: [
        'your login here'
    ]

}

export { Settings }