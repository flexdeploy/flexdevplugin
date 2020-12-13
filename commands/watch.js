const plugin = require('../plugin');
const fs = require('fs');
const utils = require('../utils');
const args = require('../args');

let _running = false;

const watch0 = (runFirst = true) => {
    const currentDir = process.cwd();

    if (!currentDir.endsWith('deploy')) {
        throw 'Watch can only be run from a plugin deploy directory';
    }

    console.log(`Watching ${currentDir} for changes`);
    
    if (runFirst) {
        changeDetected(currentDir);
    }

    fs.watch(currentDir, (event, filename) => {
        changeDetected(currentDir);
    })

}

const changeDetected = async (currentDir) => {
    if (_running) {
        return;
    }
    _running = true;

    pluginDir = utils.getParentFile(currentDir);
    console.log('Change detected, making plugin from ', pluginDir);
    try {
        const jarPath = await plugin.makePlugin(pluginDir);
        console.log('Bundled plugin ', jarPath);

        if(args.isUpload()) {
            utils.uploadJar(jarPath, args.getUploadDir());
            console.log(`Copied ${jarPath.split('\\').pop()} to ${args.getUploadDir()}`);
        }
        

        setTimeout(() => {
            _running = false;
        }, 1000);
    }
    catch(err) {
        console.error(err);
    }
}



module.exports = {
    watch: watch0
}
