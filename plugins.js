/*** List of Plugins: ****/
import { SamplePlugin } from './plugins/sample.js';
import { Join } from './plugins/join.js';
// import { PluginClass } from './path/to/file.mjs';

export function getPluginList(conns) {
    let plugins = [
        new SamplePlugin(conns),
        new Join(conns)
        // new PluginClass(conns)
    ];

    return plugins;
}