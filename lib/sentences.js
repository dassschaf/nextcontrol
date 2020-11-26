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

    localRecords: {
        noneYet: info + 'No Local records on $ff0%track%$z$s$fff %when%!',
        listBegin: info + 'No Local records on $ff0%track%$z$s$fff %when%: ',
        listItem: '$z$s$ff0#%pos%$fff: %name% ($ff0%time%$fff)',
        before: 'before this round',
        after: 'after this round',

        equalled: info + '$ff0%player%$z$s$fff just equalled their $ff0%pos%$z$s$fff record ($ff0%time%$fff$z$s)!',
        improved: info + '$ff0%player%$z$s$fff gained the $ff0%pos%$z$s$fff record ($ff0%time%$fff, $0af%imp%$fff)!',
        claimed: info + '$ff0%player%$z$s$fff claimed the $ff0%pos%$z$s$fff record ($ff0%time%$fff$z$s)!'
    }

};