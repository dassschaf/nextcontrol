class SamplePlugin {
    constructor(conns) {
        // plugin name:
        this.name           = 'Sample Plugin'
        this.author         = 'dassschaf'
        this.description    = 'Sample plugin containing the whole plugin structure'

        this.client = conns.client;
        this.database = conns.database;
    }

    
}