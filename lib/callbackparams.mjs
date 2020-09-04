//
// class wrappers for callback paramter arrays
//

/**
 * Class representing the Player connect callback parametrs
 * @member login - Player login
 * @member isSpectator - whether Player is joining as Spectator or not
 */
export class PlayerConnect {
    /**
     * Constructs PlayerConnect object from params array
     * @param params array of parameters from callback
     */
    constructor(params) {
        this.login = params[0];
        this.isSpectator = params[1];
    }
}

/**
 * Class representing the Player disconnect callback parameters
 * @member login - Player login
 * @member reason - Disconnect reason
 */
export class PlayerDisconnect {
    /**
     * Constructs PlayerDisconnect object from params array
     * @param params array of parameters from the callback
     */
    constructor(params) {
        this.login = params[0];
        this.reason = params[1];
    }
}

/**
 * Class representing the chat message callback parameters
 */
export class ChatMessage {
    /**
     * Constructs ChatMessage object from params array
     * @param params 
     */
    constructor(params) {
        this.playerUid = params[0];
        this.login = params[1];
        this.text = params[2];
        this.isCommand = params[3];
    }
}