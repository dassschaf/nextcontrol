/**
 * Utilities library for NextControl
 */

/**
 * Logging function for NextControl
 * @param status Message status: su = startup, r = running, i = important, l = log, er = error, w = warning, db = database, dg = debug
 * @param text Message content
 */
export function logger(status : string, text : string) : void

/**
 * Logging function for NextControl
 * @param text Message to be printed to log, will be printed as 'Log: <text>'
 */
export function logger(text : string) : void

/**
 * 
 * @param sentence 
 * @param fillings 
 */
export function format(sentence : string, fillings : Array<string>) : string

export function stripFormatting(string : string) : string