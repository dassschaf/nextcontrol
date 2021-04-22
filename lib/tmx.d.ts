

export class TMX {

    /**
     * Returns the TMX ID of a map, based off the map's UID
     * @param {string} uid map uid
     * @returns {Promise<Number>} map's TMX ID *or* -1 if the map is not avaliable at TMX
     */
    static getID(uid) : Promise<Number>

    /**
     * Downloads a track from TMX and returns the download path relative to the Maps directory
     * @param {number} id track's TMX ID
     * @param {string} downloadDir Directory, where the map shall be saved (downloadDir/id.Map.Gbx)
     * @returns {Promise<string>} absolute path to the map
     */
    static download(id, downloadDir) : Promise<String>

    /**
     * Translates tags strings
     * @param tagString Tags string of a TMXMapInfo object
     * @returns {Promise<String[]>}
     */
    static translateTags(tagString)

    /**
     * Updates the current, internally stored, definition of tags from TMX
     * @returns {Promise<void>}
     */
    static cacheTagDefinition()

    /**
     * Headers list for got-requests
     */
    static headers : Object

    /**
     * to be used TMX site
     */
    static site : String

}

export class TMXMapInfo {

    /** Constructs a Map Info object from a parsed json string as returned from server
     * @param p parsed JSON object
     */
    constructor(p)

    /**
     * Parses a response with multiple map infos from TMX
     * @param json Json response
     * @returns {TMXMapInfo[]} Array of map info objects
     */
    static parseMultiple(json)

    /**
     * Parses a response with a single map info from TMX
     * @param json Json response
     * @returns {TMXMapInfo} Map info object
     */
    static parseOne(json)



    // TMX ID
    TrackID : Number

    // User ID on TMX
    UserID : Number

    // Username on TMX
    Username : String

    // Original upload date
    UploadedAt : String

    // Most recent update date
    UpdatedAt : String

    // Track name on TMX
    Name : String

    // Unknown property
    TypeName : any

    // Map type as assigned by game
    MapType : String

    // Titlepack the map was made in
    TitlePack : String

    // Hidden?
    Hide : Boolean

    // Track style
    StyleName : String

    // Mood
    Mood : String

    // Display cost
    DisplayCost : Number

    // Mod
    ModName : String

    // Unknown purpose
    Lightmap : Number

    // Game version
    ExeVersion : String

    // Game version build date
    ExeBuild : String

    // Environment
    EnvironmentName : String

    // Vehicle
    VehicleName : String

    // Unlimiter required?
    UnlimiterRequired : Boolean

    // Unknown property
    RouteName : any

    // Length
    LengthName : String

    // Number of laps (1 for point-to-point)
    Laps : Number

    // Difficulty
    DifficultyName : String

    // Author time in ms
    AuthorTime : Number

    // Unknown purpose
    ReplayTypeName : String

    // WR Replay ID on TMX
    ReplayWRID : Number

    // Number of Replays
    ReplayCount : Number

    // Leaderboard value of the map
    TrackValue : Number

    // Map comment on TMX incl. formatting and control sequences
    Comments : String

    // Is unlisted?
    Unlisted : Boolean

    // Number of Awards
    AwardCount : Number

    // Mappack ID on TMX (0 if in none)
    MappackID : Number

    // Replay WR time, but apparently null
    ReplayWRTime : null

    // Replay WR driver's User ID on TMX, but apparently null
    ReplayWRUserId : null

    // Replay WR driver's Username on TMX, but apparently ""
    ReplayWRUsername : String

    // Is unreleased?
    Unreleased : Boolean

    // Is Downloadable?
    Downloadable : Boolean

    // Ingame Mapname incl. formatting
    GbxMapName : String

    // Unknown purpose
    RatingVoteCount : Number

    // Unknown purpose
    RatingVoteAverage : Number

    // Track's UID
    TrackUID : String

    // Has screenshot?
    HasScreenshot : Boolean

    // Has thumbnail?
    HasThumbnail : Boolean

    // Has Ghostblocks?
    HasGhostBlocks: Boolean

    // Number of embedded Objects
    EmbeddedObjectsCount : Number

    // Author's ingame login
    AuthorLogin : String

    // Is Maniaplanet v4 map?
    IsMP4 : Boolean

    // Unknown purpose
    SizeWarning : Boolean

    // Is in PlayLater list?
    InPLList : false

    // Unknown purpose
    Status : Number

    // Unknown purpose
    Position : Number

    // Unknown purpose
    Added : String

    // Unknown purpose
    AddedBy : Number

    // Unknown purpose
    AddedByName : String

    // Unknown purpose
    FeatureComment : String

    // Unknown purpose
    FeaturePinned : Boolean

    // GBX parser version
    ParserVersion : Number

    // Size of embedded items (in bytes)
    EmbeddedItemsSize : Number

    // Map tags on TMX (ID, comma separated)
    Tags : String

    // Number of screenshots
    ImageCount : Number

    // Release date
    ReleaseDate : any

    // Release date, as string
    ReleaseDateString : String

    // Unknown purpose
    TrackTimes : any

}

