import { Sentences } from '../lib/sentences.js'
import { logger, format, stripFormatting } from '../lib/utilities.js'
import { NextControl } from '../nextcontrol.js'
import { Settings } from '../settings.js'
let dbtype = Settings.usedDatabase.toLocaleLowerCase();
import * as Classes from '../lib/classes.js'
import {Logger} from "../lib/logger.js";

/**
 * Join and leave message plugin
 */
export class Join {

    name           = 'Join and Leave'
    author         = 'dassschaf'
    description    = 'Join and leave message plugin'

    /**
     * Local reference to the main instance
     * @type {NextControl}
     */
    nextcontrol

    /**
     * Constructor, registering the chat commands at the main class upon plugin loading
     * @param {NextControl} nextcontrol 
     */
    constructor(nextcontrol) {
        // save reference
        this.nextcontrol = nextcontrol;
    }

    /**
     * Function run, when a player joins the server
     * @param {Classes.PlayerInfo} player Player info
     * @param {Boolean} isSpectator whether player spectates or not
     */
    async onPlayerConnect(player, isSpectator) {                    
        
        if (dbtype === 'mongodb') {
            await this.nextcontrol.mongoDb.collection('players').updateOne({login: player.login}, {$set: player}, {upsert: true});
        } else if (dbtype === 'mysql') {
            this.nextcontrol.mysql.query('SELECT * FROM players WHERE login = ?', [player.login]).then(rows=>{
                if (rows.length === 0) {
                    this.nextcontrol.mysql.query('INSERT INTO players (login, name) VALUES (?,?)', [player.login, player.name]).catch(err => {
                        if (err) {
                            Logger.error(err);
                        }
                    });
                } else {
                    // If the player exists, update the name
                    this.nextcontrol.mysql.query('UPDATE players SET name = ? WHERE login = ?', [player.name, player.login]).catch(err => {
                        if (err) {
                            Logger.error(err);
                        }
                    });
                }
            }).catch(err=>{
                Logger.error(err);
            });
        }

        if (Settings.admins.includes(player.login)) {
            Logger.info('Admin ' + stripFormatting(player.name) + ' has joined the server');
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.adminConnect, { player: player.name })]);
        }

        else {
            Logger.info(stripFormatting(player.name) + ' has joined the server');
            await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.playerConnect, { player: player.name })]);
        }        
    }

    /**
     * Function run, when a player disconnects
     * @param {Classes.PlayerInfo} player Playerinfo of leaving player 
     * @param {String} reason Reason for disconnection
     */
    async onPlayerDisconnect(player, reason) {
        Logger.info(stripFormatting(player.name) + ' has left the server, reason: ' + reason);
        await this.nextcontrol.client.query('ChatSendServerMessage', [format(Sentences.playerDisconnect, { player: player.name })]);
    }
}