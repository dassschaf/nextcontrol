// sentence bank
import { Settings } from '../settings.js';

const prefix = '~~'

const   info    = '$ff0' + prefix + ' $z$s$fff',
        warning = '$fa0' + prefix + ' $z$s$fff',
        error   = '$f00' + prefix + ' $z$s$fff',
        priv = '$0af' + prefix + ' $z$s$fff';

export const Sentences = {

    startupFinished: info + 'NextControl has successfully started.',
    shuttingDown: info + 'NextControl is shutting down...',

    playerConnect: info + '$ff0%player%$z$s$fff has joined the server.',
    adminConnect: info + 'Admin $ff0%player%$z$s$fff has joined the server.',
    playerDisconnect: info + '$ff0%player%$z$s$fff has left the server.',

    playerNotAdmin: warning + 'You do not have the rights to run admin commands!',

    errorMessage: error + '%error%',

    admin : {
        restart: info + '$ff0%name%$z$s$fff restarts the current map.',
        skip: info + '$ff0%name%$z$s$fff skips the current map.',
        replay: info + '$ff0%name%$z$s$fff queues the current map for replay.',
        extend: info + '$ff0%name%$z$s$fff extends the current map\'s time.',

        added: info + '$ff0%name%$z$s$fff added $ff0%map%$z$s$fff to the map list.',
        addedTmx: info + '$ff0%name%$z$s$fff added $ff0%map%$z$s$fff from $7f7TMX$fff to the map list.',
        addedTmxPack: info + '$ff0%name%$z$s$fff added the pack $ff0%mappack%$z$s$fff from $7f7TMX$fff to the map list.',
        addedUrl: info + '$ff0%name%$z$s$fff added $ff0%map%$z$s$fff from an URL to the map list.',
        addedLocal: info + '$ff0%name%$z$s$fff added local map $ff0%map%$z$s$fff to the map list.',
        alreadyAdded: warning + '$ff0%map%$z$s$fff is already in the map list.',
        addTmxFailedInvalidID : warning + 'Invalid ID.',
        addLocalFailedInvalidPth : warning + 'Invalid path.',
        invalidParams: warning + 'Invalid parameters.',

        removed: info + '$ff0%name%$z$s$fff removed $ff0%map%$z$s$fff from the map list.',

        extended: info + '$ff0%name%$z$s$fff has extended the current map\'s time by $ff0%time%$fff seconds.',
        cannotExtend: error + 'This gamemode does not support extending the map\'s time',
        extendError: error + 'An error occurred trying to extend the time. Check the logs.',
        settingsSaved: priv + 'Successfully saved settings.',
        settingsRead: priv + 'Successfully read settings.',
        settingsReset: priv + 'Successfully reset settings.',
        settingsSet: priv + 'Successfully changed a setting.',
        settingsKept: priv + 'Settings will not be reset to default at map change.',

        forceMod: {
            applied: priv + 'Mod successfully applied, changes will be visible starting with the next map.',
            reset: priv + 'Default mods will be displayed again starting with next map',
            overrideOn: priv + 'Map mod override enabled.',
            overrideOff: priv + 'Map mod override disabled.',
            saved: priv + 'Settings saved to file.',
            read: priv + 'Settings read from file.',
            invalid: warning + 'Invalid parameters. Valid parameters are: save, read, enable, disable, reset and an URL to a mod.'
        },


        requiresList: warning + 'You first need to get a list of %type%, before doing this operation.'
    },

    jukebox : {
        hasQueued: info + '$ff0%name%$z$s$fff has added $ff0%map%$z$s$fff to the jukebox.',
        nextMapIs: info + 'Next map is $ff0%map%$z$s$fff, as wished by $ff0%name%$fff$z$s.',
        leftSkipWish: info + 'Jukeboxed map $ff0%map%$z$s$fff skipped, because $ff0%name%$z$s$fff left.',
        priorityAdd: info + '$ff0%name%$z$s$fff set next played map to $ff0%map%$z$s$fff.',
        cleared: info + '$ff0%name%$z$s$fff has cleared the jukebox.',

        requiresList: warning + 'To jukebox a map, first use $i/list maps$i to get a number of maps you can jukebox.',
        requiresId: warning + 'To jukebox a map, you must specify the number of the desired map from your recent map list.',
        invalidNumber: warning + 'Invalid map number.',
        invalidIndex: warning + 'Invalid map number: You can only jukebox maps from $ff0#%lo%$fff to $ff0#%hi%$fff with your current map list.'
    },

    lists : {
        header: priv + '$ff0%type%$fff list: Page $ff0%pg%$fff of $ff0%pages%$fff:',
        playerItem: '#$ff0%id%$fff: %name%$z$s$fff (%login%)',
        mapItem: '#$ff0%id%$fff: %name%$z$s$fff',

        showInvalidParams: warning + 'Invaid parameters. Use /list show <list> <page> instead. Valid lists are "maps" and "players".'
    },

    localRecords: {
        noneYet: info + 'No Local records on $ff0%map%$z$s$fff %when%!',
        listBegin: info + 'Local records on $ff0%map%$z$s$fff %when%: ',
        listItem: '$z$s$ff0#%pos%$fff: %name% ($ff0%time%$fff)',
        before: 'before this round',
        after: 'after this round',
        rightnow: 'right now',

        equalled: info + '$ff0%player%$z$s$fff just equalled their $ff0%pos%$z$s$fff local record ($ff0%time%$fff$z$s)!',
        improved: info + '$ff0%player%$z$s$fff gained the $ff0%pos%$z$s$fff local record ($ff0%time%$fff, $0af%imp%$fff)!',
        claimed: info + '$ff0%player%$z$s$fff claimed the $ff0%pos%$z$s$fff local record ($ff0%time%$fff$z$s)!'
    },

    karma : {
        currentKarma: info + 'Current Karma on $ff0%map%$z$s$fff: $ff0%avg%',
        voteSuccessful: priv + 'Vote successful.',
        alreadyVoted: priv + 'You already voted %score% on this map.'
    },

    discord: {
        prefix: {
            noColor: prefix + " Discord: $s",
            info: '$ff0' + prefix + ' Discord: $z$s$fff',
            warning: '$fa0' + prefix + ' Discord: $z$s$fff',
            error: '$f00' + prefix + ' Discord: $z$s$fff',
            priv: '$0af' + prefix + ' Discord: $z$s$fff'
        },
        logReady: {
            title: 'NextControl has successfully started.',
            playersOnline: '%nbPlayers% players online',
            actualMap: 'Current map: `%mapName%` by %mapAuthor%'
        },
        serverShutdown: {
            title: "Trackmania dedicated server has stopped",
            description: "Shutting down NextControl..."
        },
        joinMessage: {
            title: "Player join",
            normalJoin: "**%player%** (`%login%`) has joined the server.",
            specJoin: "**%player%** (`%login%`) has joined the server as spectator."
        },
        leftMessage: {
            title: "Player left",
            description: "**%player%** (`%login%`) has left the server."
        },
        crossChat: "$06F $z$s[%author%] %content%"
    }

};