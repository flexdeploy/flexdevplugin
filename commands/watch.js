const plugin = require('../plugin');
const fs = require('fs');
const utils = require('../utils');

let _running = false;
let _uploadDir;

const watch0 = (uploadDir, runFirst = true) => {
    const currentDir = process.cwd();
    _uploadDir = uploadDir;

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
    console.log(_running);
    if (_running) {
        return;
    }

    _running = true;

    pluginDir = utils.getParentFile(currentDir);
    console.log('Change detected, making plugin from ', pluginDir);
    try {
        const jarPath = await plugin.makePlugin(pluginDir);
        console.log('Bundled plugin ', jarPath);

        if(_uploadDir) {
            utils.uploadJar(jarPath, _uploadDir);
            console.log(`Copied ${jarPath.split('\\').pop()} to ${_uploadDir}`);
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
