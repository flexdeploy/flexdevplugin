const plugin = require('../plugin');
const utils = require('../utils');

let _uploadDir;

const bundle0 = (uploadDir) => {
    const currentDir = process.cwd();
    _uploadDir = uploadDir;

    if (!currentDir.endsWith('deploy')) {
        throw 'Bundle can only be run from a plugin deploy directory';
    }

    pluginDir = utils.getParentFile(currentDir);
    console.log('Bundling plugin from ', pluginDir);
    make(pluginDir);
}

const make = async (pluginDir) => {
    try {
        const jarPath = await plugin.makePlugin(pluginDir);
        console.log('Bundled plugin ', jarPath);

        if(_uploadDir) {
            utils.uploadJar(jarPath, _uploadDir);
            console.log(`Copied ${jarPath.split('\\').pop()} to ${_uploadDir}`);
        }
    }
    catch (err) {
        console.error(err);
    }
}


module.exports = {
    bundle: bundle0
}
