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
 * Formatting aid for the sentence bank
 * @param sentence Sentence from the sentence bank containing placeholders
 * @param fillings Object containing the placeholders by the placeholder key: { player: "dassschaf", pos: "1", score: "100" }
 */
export function format(sentence : string, fillings : any) : string

/**
 * Removes all $-formatting from a string
 * @param string clean text string
 */
export function stripFormatting(string : string) : string

/**
 * Formats a time in milliseconds to a human-readable string
 * @param ms time in ms
 */
export function msToString(ms : Number) : string

/**
 * Gives the proper n-th suffix for a number
 * @param d number
 */
export function nth(d : Number) : string

/**
 * Determines whether a given string can be understood as a number or not
 * @param str Input string
 */
export function isNum (str : String) : boolean
