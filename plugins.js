import { NextControl } from './nextcontrol.js';

/*** List of Plugins: ****/
import { SamplePlugin } from './plugins/sample.js';
import { Join } from './plugins/join.js';
import { LocalRecords } from './plugins/localRecords.js';

// to add another plugin, uncomment and adjust this line:
// import { PluginClass } from './path/to/file.mjs';

/**
 * Returns the list of ready plugins
 * @param {NextControl} nextcontrol NextControl instance
 */
export function getPluginList(nextcontrol) {
    let plugins = [
        new SamplePlugin(nextcontrol),
        new Join(nextcontrol),
        new LocalRecords(nextcontrol)

        // to add another plugin, add a plugin instance to this array:
        // new PluginClass(nextcontrol)
    ];

    return plugins;
}