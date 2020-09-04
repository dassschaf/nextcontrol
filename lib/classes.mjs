/**
 * Game Server Version information
 */
class ServerVersion {
    /**
     * Constructs Version information object
     * @param struct GetVersion method's result
     */
    constructor(struct) {
        this.name = struct.Name;
        this.title = struct.TitleId;
        this.version = struct.Version;
        this.build = struct.Build;
        this.apiVersion = struct.ApiVersion;
    }
}

/**
 * Map medals object
 */
class Medals {
    /**
     * Constructor to construct Medals objects
     * @param {Number} b Bronze Medal time
     * @param {Number} s Silver Medal time
     * @param {Number} g Gold Medal time
     * @param {Number} a Author Medal time = Validation time
     */
    constructor(b, s, g, a)
    {
        this.bronze = b;
        this.silver = s;
        this.gold = g;
        this.author = a;
    }

    /**
     * Determines what medal the player got
     * @param {Number} time Player's reached time
     * @returns {string|boolean} Medal name or 'false' when no medal reached
     */
    reachedMedal(time) {
        if (time > silver && time <= bronze) return 'bronze';
        if (time > gold && time <= silver) return 'silver';
        if (time > author && time <= gold) return 'gold';
        if (time <= author) return 'author';
        return false;
    }
}

/**
 * Map Info object
 */
class Map {
    /**
     * Constructs map info object
     * @param struct map info struct from server
     */
    constructor(struct) {
        this.uid = struct.Uid;
        this.name = struct.Name;
        this.file = struct.FileName;
        this.author = structAuthor;
        this.envi = struct.Environnement;
        this.mood = struct.Mood;
        this.medals = new Medals(struct.BronzeTime, struct.SilverTime, struct.GoldTime, struct.AuthorTime);
        this.coppers = struct.CopperPrice;
        this.isMultilap = struct.LapRace;
        this.nbLaps = struct.NbLaps;
        this.nbCheckpoints = struct.NbCheckpoints;
        this.type = struct.MapType;
        this.style = struct.MapStyle;
        this.tmxid = 0;
    } 

    /**
     * Adds TMX ID to map info object
     * @param {Number} id map's TMX ID
     */
    setTMXId(id) { this.tmxid = id }
}

/**
 * Server Status information
 */
class ServerStatus {
    /**
     * Constructs server status info object
     * @param struct status struct returned from server
     */
    constructor(struct) {
        this.code = struct.Code;
        this.name = struct.Name;
    }
}

/**
 * Call Vote information
 */
class CallVote {
    /**
     * Constructs call vote status from server struct
     * @param struct call vote struct returned from server
     */
    constructor(struct) {
        this.login = struct.CallerLogin;
        this.command = struct.CmdName;
        this.parameter = struct.CmdParam;
    }
}

/**
 * Object for ChatSendServerMessageToLanguage method's parameter array
 */
class LanguageMessage {
    /**
     * @param lang Message language
     * @param text Message content
     */
    constructor(lang, text) {
        this.lang = lang;
        this.text = text;
    }
}

// export statement:
export { ServerVersion, Map, Medals, ServerStatus, CallVote, LanguageMessage }