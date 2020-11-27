const Settings = {
    
    trackmania: {
        port: '5555',           // server port
        login: 'SuperAdmin',    // login for SuperAdmin rights
        password: 'SuperAdmin', // password 

        game: 'TM2020',         // game: TM2 or TM2020

        server_login: 'blah',   // the server's login at the masterserver

        matchsettings_file: 'set.txt'
    },

    database: {
        uri: "mongodb://localhost/?poolSize=20&w=majority",
        database: 'nextcontrol'
    },

    disabledPlugins: ['Sample Plugin'],

    admins: [
        'your login here'
    ]

}

export { Settings }