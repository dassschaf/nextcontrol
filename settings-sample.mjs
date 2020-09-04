const Settings = {
    
    trackmania: {
        port: '5555',           // server port
        login: 'SuperAdmin',    // login for SuperAdmin rights
        password: 'SuperAdmin'  // password 
    },

    database: {
        uri: "mongodb://localhost/?poolSize=20&w=majority",
        database: 'nextcontrol'
    },

    disabledPlugins: [],

    admins: [
        'your login here'
    ]

}

export { Settings }