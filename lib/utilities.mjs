import process from 'process';
import chalk from 'chalk';

/**
 * Logging function for NextControl
 * @param {string} status Status code, su = startup, dg = debug, r = running, db = database, w = warning, er = error, l = log, i = importamt
 * @param {string} text Text to be logged
 */
function log(status, text) {
    if (text == undefined) { text = status; status = 'l'; }

    let runtime = (Math.round(process.uptime() * 100)) / 100;

    if (status === 'su') console.log( chalk.green('Startup: ') + text + ' (' + runtime + ')' );
    if (status === 'dg') console.log( chalk.magenta('Debug: ') + text + ' (' + runtime + ')' );
    if (status === 'r') console.log( chalk.greenBright('Running: ') + text + ' (' + runtime + ')' );
    if (status === 'db') console.log( chalk.blueBright('Database: ') + text + ' (' + runtime + ')' );
    if (status === 'w') console.log( chalk.bold(chalk.yellow('Warning: ')) + text + ' (' + runtime + ')' );
    if (status === 'er') console.log( chalk.bold(chalk.red('Error: ')) + text + ' (' + runtime + ')' );
    if (status === 'l') console.log( chalk.magenta('Log: ') + text + ' (' + runtime + ')' );
    if (status === 'i') console.log( chalk.bold(chalk.cyan('----- ') + text + ' after ' + runtime + ' seconds ' + chalk.cyan('-----')) );
}

export { log }