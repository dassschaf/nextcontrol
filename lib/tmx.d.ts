

export class TMX {

    /**
     * Returns the TMX ID of a map, based off the map's UID
     * @param {string} uid map uid
     * @returns {Number} map's TMX ID *or* -1 if the map is not avaliable at TMX
     */
    static async getID(uid) : Number

    /**
     * Headers list for got-requests
     */
    static headers : Object

    /**
     * to be used TMX site
     */
    static site : String
}