// sentence bank
import { Settings } from '../settings.js';

const prefix = '~~'

const   info    = '$ff0' + prefix + ' $z$s$fff',
        warning = '$fa0' + prefix + ' $z$s$fff',
        error   = '$f00' + prefix + ' $z$s$fff',
        priv = '$999' + prefix + ' $z$s$fff';

export const Sentences = {

    startupFinished: info + 'NextControl has successfully started.',
    shuttingDown: info + 'NextControl is shutting down...',

    playerConnect: info + '$ff0%player%$z$s$fff has joined the server.',
    adminConnect: info + 'Admin $ff0%player%$z$s$fff has joined the server.',
    playerDisconnect: info + '$ff0%player%$z$s$fff has left the server.',

    playerNotAdmin: warning + 'You do not have the rights to run admin commands!',

    admin : {
        restart: info + '$ff0%name%$z$s$fff restarts the current track.',
        skip: info + '$ff0%name%$z$s$fff skips the current track.',
        replay: info + '$ff0%name%$z$s$fff queues the current track for replay.',
        extend: info + '$ff0%name%$z$s$fff extends the current track\'s time.',

        added: info + '$ff0%name%$z$s$fff added $ff0%track%$z$s$fff to the map list.',
        addedTmx: info + '$ff0%name%$z$s$fff added $ff0%track%$z$s$fff from $7f7TMX$fff to the map list.',
        addedUrl: info + '$ff0%name%$z$s$fff added $ff0%track%$z$s$fff from an URL to the map list.',
        addedLocal: info + '$ff0%name%$z$s$fff added local map $ff0%track%$z$s$fff to the map list.',
        addTmxFailedInvalidID : priv + 'Invalid ID.',
        addLocalFailedInvalidPth : priv + 'Invalid path.'
    },

    jukebox : {
        hasQueued: info + '$ff0%name%$z$s$fff has added $ff0%map%$z$s$fff to the jukebox.',
        nextMapIs: info + 'Next map is $ff0%map%$z$s$fff, as wished by $ff0%name%$fff$z$s.',
        leftSkipWish: info + 'Jukeboxed map $ff0%map%$z$s$fff skipped, because $ff0%name%$z$s$fff left.'
    },

    localRecords: {
        noneYet: info + 'No Local records on $ff0%track%$z$s$fff %when%!',
        listBegin: info + 'Local records on $ff0%track%$z$s$fff %when%: ',
        listItem: '$z$s$ff0#%pos%$fff: %name% ($ff0%time%$fff)',
        before: 'before this round',
        after: 'after this round',
        rightnow: 'right now',

        equalled: info + '$ff0%player%$z$s$fff just equalled their $ff0%pos%$z$s$fff record ($ff0%time%$fff$z$s)!',
        improved: info + '$ff0%player%$z$s$fff gained the $ff0%pos%$z$s$fff record ($ff0%time%$fff, $0af%imp%$fff)!',
        claimed: info + '$ff0%player%$z$s$fff claimed the $ff0%pos%$z$s$fff record ($ff0%time%$fff$z$s)!'
    }

};