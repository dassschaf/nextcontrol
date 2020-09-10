import process from 'process';
import chalk from 'chalk';

/**
 * Logging function for NextControl
 * @param {string} status Status code, su = startup, dg = debug, r = running, db = database, w = warning, er = error, l = log, i = importamt
 * @param {string} text Text to be logged
 */
export function logger(status, text) {
    // fall back to normal log status if there's no status given but the text is passed as status
    if (text == undefined) { text = status; status = 'l'; }

    // if someone passed something not being a string he'll get this at least
    if (typeof text != 'string') text = text.toString();

    // runtime since startup in seconds
    let runtime = (Math.round((process.uptime()/1) * 100)) / 100;

    if (status === 'su') console.log( chalk.green('Startup: ') + text + ' (' + runtime + ')' );
    if (status === 'dg') console.log( chalk.magenta('Debug: ') + text + ' (' + runtime + ')' );
    if (status === 'r') console.log( chalk.greenBright('Running: ') + text + ' (' + runtime + ')' );
    if (status === 'db') console.log( chalk.blueBright('Database: ') + text + ' (' + runtime + ')' );
    if (status === 'w') console.log( chalk.bold(chalk.yellow('Warning: ')) + text + ' (' + runtime + ')' );
    if (status === 'er') console.log( chalk.bold(chalk.red('Error: ')) + text + ' (' + runtime + ')' );
    if (status === 'l') console.log( chalk.magenta('Log: ') + text + ' (' + runtime + ')' );
    if (status === 'i') console.log( chalk.bold(chalk.cyan('----- ') + text + ' after ' + runtime + ' seconds ' + chalk.cyan('-----')) );
}

export function format(sentence, fillings) {
    let output = sentence, pos = 1;
    
    fillings.forEach(filling => {
        output = output.replace('%' + pos + '%', filling);
        pos++;
    });

    return output;
}

export function stripFormatting(string) {
    return string.replace(/[$][nmwoszi]|[$][hl][\[][a-zA-Z0-9/?#!&\.\\\-_=@$'()+,;:]*[\]]|[$]{1}[0-f]{3}/gi, '');
}