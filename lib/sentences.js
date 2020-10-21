// sentence bank
import { Settings } from '../settings.js';

const prefix = '~~'

const   info    = '$ff0' + prefix + ' $z$s$fff',
        warning = '$fa0' + prefix + ' $z$s$fff',
        error   = '$f00' + prefix + ' $z$s$fff'


const Sentences = {

    startupFinished: info + 'NextControl has successfully started.',
    shuttingDown: info + 'NextControl is shutting down...',

    playerConnect: info + '$ff0%player%$z$s$fff has joined the server.',
    playerDisconnect: info + '$ff0%player%$z$s$fff has left the server.',

    playerNotAdmin: warning + 'You do not have the rights to run admin commands!',

    localRecords: {
        noneYet: info + 'No Local records on $ff0%track%$z$s$fff %when%!',
        before: 'before this round',
        after: 'after this round',

        equalled: info + '$ff0%player%$z$s$fff just equalled their $ff0%pos%$z$s$fff record ($ff0%3%$fff$z$s)!'
    }

}

export { Sentences }