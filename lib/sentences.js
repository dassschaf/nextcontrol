// sentence bank
import { Settings } from '../settings.js';

const prefix = '~~'

const   info    = '$ff0' + prefix + ' $z$s$fff',
        warning = '$fa0' + prefix + ' $z$s$fff',
        error   = '$f00' + prefix + ' $z$s$fff'


const Sentences = {

    startupFinished: info + 'NextControl has successfully started.',
    shuttingDown: info + 'NextControl is shutting down...',

    playerConnect: info + '$ff0%1%$z$s$fff has joined the server.',
    playerDisconnect: info + '$ff0%1%$z$s$fff has left the server.',

    playerNotAdmin: warning + 'You do not have the rights to run admin commands!',

    adminRestart: info + '$ff0%1%$z$s$fff restarts the current track.',
    adminSkip: info + '$ff0%1%$z$s$fff skips the current track.',
    adminRestart: info + '$ff0%1%$z$s$fff queues the current track for replay.',
    adminExtend: info + '$ff0%1%$z$s$fff extends the current track\'s time.'

}

export { Sentences }