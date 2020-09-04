// sentence bank
import { Settings } from '../settings.mjs';

const prefix = '~~'

const   info    = '$ff0' + prefix + ' $z$fff',
        warning = '$fa0' + prefix + ' $z$fff',
        error   = '$f00' + prefix + ' $z$fff'


const Sentences = {

    startupFinished: info + 'NextControl has successfully started.',
    shuttingDown: info + 'NextControl is shutting down...',

    playerConnect: info + '$ff0%1%$z$fff has joined the server.',
    playerDisconnect: info + '$ff0%1%s$z$fff has left the server.'

}

export { Sentences }