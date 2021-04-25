import got from 'got';
import { Settings } from '../settings.js';
import fs from 'fs';

/**
 * TMX API wrapper class
 */
export class TMX {

    /**
     * The headers sent to TMX
     */
    static headers = {
        'X-ManiaPlanet-ServerLogin': Settings.trackmania.server_login
    };

    /**
     * The site we interact with, TMX for TM2020, TM.MX for TM2
     */
    static site = (Settings.trackmania.game === 'TM2020') ? 'https://trackmania.exchange' : 'https://tm.mania.exchange';

    /**
     * Tags definition from TMX/MX --- please use translateTags() instead of directly accessing this object
     * @type {TagDefinition[]}
     */
    static tagsDefinition = null;

    /**
     * Downloads a map from TMX and returns the download path relative to the Maps directory
     * @param {number} id map's TMX ID
     * @param {string} downloadDir Directory, where the map shall be saved (downloadDir/id.Map.Gbx)
     * @returns {Promise<String>} absolute path to the map
     */
    static async download(id, downloadDir) {
        const response = await got({url: this.site + '/maps/download/' + id, encoding: 'binary', headers: this.headers});
        const body = response.body;

        // check if the target directory we save maps to exists
        if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

        fs.writeFileSync(downloadDir + id + '.Map.Gbx', body, 'binary');

        return downloadDir + id + '.Map.Gbx';
    }

    /**
     * Updates the current definition of tags from TMX
     * @returns {Promise<void>}
     */
    static async cacheTagDefinition() {
        const url = this.site + '/api/tags/gettags';
        this.tagsDefinition = (await got(url, {responseType: 'json', headers: this.headers})).body;
    }

    /**
     * Returns the TMX ID of a map, based off the map's UID
     * @param {string} uid map uid
     */
    static async getID(uid) {
        // API call URL
        let url = this.site + '/api/maps/get_map_info/multi/';

        // append UID to api call
        url += uid;

        const response = await got(url, {responseType: 'json', headers: this.headers});

        if (response.body.length > 0)
            return response.body[0].TrackID;

        else return -1;
    }

    /**
     * Translates tags strings
     * @param tagString Tags string of a TMXMapInfo object
     * @returns {Promise<String[]>}
     */
    static async translateTags(tagString) {
        let tagIDs = tagString.split(",").map(id => { return Number(id); }),
            tagStrings = [];

        if (this.tagsDefinition == null) await this.cacheTagDefinition();

        tagIDs.forEach(id => {
            this.tagsDefinition.forEach(def => {
                if (id === def.ID)
                    tagStrings.push(def.Name);
            });
        });

        return tagStrings;
    }
}

export class TMXMapInfo {

    /** Constructs a Map Info object from the json string as returned from server
     * @param p parsed JSON object
     */
    constructor(p) {
        this.TrackID = p.TrackID;
        this.UserID = p.UserID;
        this.Username = p.Username;
        this.UploadedAt = p.UploadedAt;
        this.UpdatedAt = p.UpdatedAt;
        this.Name = p.Name;
        this.TypeName = p.TypeName; // seems to be null
        this.MapType = p.MapType;
        this.TitlePack = p.TitlePack;
        this.Hide = p.Hide;
        this.StyleName = p.StyleName;
        this.Mood = p.Mood;
        this.DisplayCost = p.DisplayCost;
        this.ModName = p.ModName;
        this.Lightmap = p.Lightmap;
        this.ExeVersion = p.ExeVersion;
        this.ExeBuild = p.ExeBuild;
        this.EnvironmentName = p.EnvironmentName;
        this.VehicleName = p.VehicleName;
        this.UnlimiterRequired = p.UnlimiterRequired;
        this.RouteName = p.RouteName; // seems to be null
        this.LengthName = p.LengthName;
        this.Laps = p.Laps; // 1 for sprint
        this.DifficultyName = p.DifficultyName;
        this.AuthorTime = p.AuthorTime;
        this.ReplayTypeName = p.ReplayTypeName;
        this.ReplayWRID = p.ReplayWRID;
        this.ReplayCount = p.ReplayCount;
        this.TrackValue = p.TrackValue;
        this.Comments = p.Comments;
        this.Unlisted = p.Unlisted;
        this.AwardCount = p.AwardCount;
        this.CommentCount = p.CommentCount;
        this.MappackID = p.MappackID;
        this.ReplayWRTime = p.ReplayWRTime;
        this.ReplayWRUserID = p.ReplayWRUserID;
        this.ReplayWRUsername = p.ReplayWRUsername;
        this.Unreleased = p.Unreleased;
        this.Downloadable = p.Downloadable;
        this.GbxMapName = p.GbxMapName;
        this.RatingVoteCount = p.RatingVoteCount;
        this.RatingVoteAverage = p.RatingVoteAverage;
        this.TrackUID = p.TrackUID;
        this.HasScreenshot = p.HasScreenshot;
        this.HasThumbnail = p.HasThumbnail;
        this.HasGhostBlocks = p.HasGhostBlocks;
        this.EmbeddedObjectsCount = p.EmbeddedObjectsCount;
        this.AuthorLogin = p.AuthorLogin;
        this.IsMP4 = p.IsMP4;
        this.SizeWarning = p.SizeWarning;
        this.InPLList = p.InPLList;
        this.Status = p.Status;
        this.Position = p.Position;
        this.Added = p.Added;
        this.AddedBy = p.AddedBy;
        this.AddedByName = p.AddedByName;
        this.FeatureComment = p.FeatureComment;
        this.FeaturePinned = p.FeaturePinned;
        this.ParserVersion = p.ParserVersion;
        this.EmbeddedItemsSize = p.EmbeddedItemsSize;
        this.Tags = p.Tags;
        this.ImageCount = p.ImageCount;
        this.ReleaseDate = p.ReleaseDate;
        this.ReleaseDateString = p.ReleaseDateString;
        this.TrackTimes = p.TrackTimes;
    }

    /**
     * Parses a response with multiple map infos from TMX
     * @param {Object[]} json parsed json response
     * @returns {TMXMapInfo[]} Array of map info objects
     */
    static parseMultiple(json) {
        let returnArray = [];

        for (let o of json) {
            returnArray.push(new TMXMapInfo(o));
        }

        return returnArray;
    }
}

class TagDefinition {
    /**
     * Tag ID
     * @type {Number}
     */
    ID

    /**
     * Tag Name
     * @type {String}
     */
    Name

    /**
     * Tag Color on TMX (hexadecimal)
     * @type {String}
     */
    Color

    /**
     * Tag score ?!?!?!?
     * @type {Number}
     */
    Score
}
