import { NextControl } from './nextcontrol.js';

/*** List of Plugins: ****/
import { SamplePlugin } from './plugins/sample.js';
import { Join } from './plugins/join.js';
import { LocalRecords } from './plugins/localRecords.js';
import { AdminSuite } from './plugins/admin.js';
import { ListsPlugin } from './plugins/list.js';
import { JukeboxPlugin } from './plugins/jukebox.js';
import { ForceModsPlugin } from "./plugins/forceMods.js";
import { DiscordBot } from "./plugins/discord.js";
import { HelpCommand } from "./plugins/help.js";

// to add another plugin, uncomment and adjust this line:
// import { PluginClass } from './path/to/file.js';

/**
 * Returns the list of ready plugins
 * @param {NextControl} nextcontrol NextControl instance
 */
export function getPluginList(nextcontrol) {
    let plugins = [
        new SamplePlugin(nextcontrol),
        new Join(nextcontrol),
        new LocalRecords(nextcontrol),
        new AdminSuite(nextcontrol),
        new ListsPlugin(nextcontrol),
        new JukeboxPlugin(nextcontrol),
        new ForceModsPlugin(nextcontrol),
        new DiscordBot(nextcontrol),
        new HelpCommand(nextcontrol),

        // to add another plugin, add a plugin instance to this array:
        // new PluginClass(nextcontrol)
    ];

    return plugins;
}