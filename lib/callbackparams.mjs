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