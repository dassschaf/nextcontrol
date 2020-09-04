/*** List of Plugins: ****/
import { SamplePlugin } from './plugins/sample.mjs';
import { Join } from './plugins/join.mjs';
// import { PluginClass } from './path/to/file.mjs';

export function getPluginList(conns) {
    let plugins = [
        new SamplePlugin(conns),
        new Join(conns)
    ];

    return plugins;
}