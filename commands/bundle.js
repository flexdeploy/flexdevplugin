const plugin = require('../plugin');
const utils = require('../utils');
const args = require('../args');

const bundle0 = (uploadDir) => {
    const currentDir = process.cwd();

    if (!currentDir.endsWith('deploy')) {
        throw 'Bundle can only be run from a plugin deploy directory';
    }

    pluginDir = utils.getParentFile(currentDir);
    console.log('Bundling plugin from ', pluginDir);
    make(pluginDir);
}

const make = async (pluginDir) => {
    try {
        const jarPath = await plugin.makePlugin(pluginDir, args.getVersion());
        console.log('Bundled plugin ', jarPath);

        if(args.isUpload()) {
            utils.uploadJar(jarPath, args.getUploadDir());
            console.log(`Copied ${jarPath.split('\\').pop()} to ${args.getUploadDir()}`);
        }
    }
    catch (err) {
        console.error(err);
    }
}


module.exports = {
    bundle: bundle0
}
