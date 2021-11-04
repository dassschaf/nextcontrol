import chalk from "chalk";
import process from "process";

/**
 * logging utility class
 */
export class Logger {

    /**
     * Shorthand function to format the current process uptime into a pretty number
     * @returns {Number} uptime in seconds
     */
    static uptime() {
        // runtime since startup in seconds
        return (Math.round((process.uptime()/1) * 100)) / 100;
    }

    /**
     * Print an error message to the console
     * @param {String} message 
     */
    static error(message) {        // print error message
        console.log(chalk.red.underline("Error:") + " " + message + chalk.red(" (" + this.uptime() + "s)"));
    }

    /** 
     * Print a warning message to the console
     * @param {String} message 
     */
    static warning(message) {
        // print warning message
        console.log(chalk.yellow.underline("Warning:") + " " + message + chalk.yellow(" (" + this.uptime() + "s)"));
    }

    /**
     * Print a debug message to the console
     * @param {String} message 
     */
    static debug(message) {
        // print debug message
        console.log(chalk.cyan.underline("Debug:") + " " + message + chalk.cyan(" (" + this.uptime() + "s)"));
    }

    /**
     * Print an info message to the console
     * @param {String} message 
     */
    static info(message) {
        // print info message
        console.log(chalk.green.underline("Info:") + " " + message + chalk.green(" (" + this.uptime() + "s)"));
    }

    /**
     * Print a startup message to the console,
     * only to be used during the startup of nextcontrol.
     * @param {String} message 
     */
    static startup(message) {
        // print startup message
        console.log(chalk.magenta.underline("Startup:") + " " + message + chalk.magenta(" (" + this.uptime() + "s)"));
    }

    /**
     * Print a database info message to the console,
     * only to be used with database requests and related information.
     * @param {String} message 
     */
    static database(message) {
        // print database message
        console.log(chalk.green.underline("Database:") + " " + message + chalk.blue(" (" + this.uptime() + "s)"));
    }

    /**
     * Print an important message to the console, that should stand out significantly
     * Don't use it often, please.
     * @param {String} message
     */
    static important(message) {
        // print important message
        console.log(chalk.bold.magenta.underline("Important:") + " " + message + chalk.magenta(" (" + this.uptime() + "s)"));
    }

}