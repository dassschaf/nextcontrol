/*** List of Plugins: ****/
import { SamplePlugin } from './plugins/sample.mjs';
// import { PluginClass } from './path/to/file.mjs';

function getPluginList(conns) {
    let plugins = [
        new SamplePlugin(conns)
    ];

    return plugins;
}