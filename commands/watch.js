const plugin = require('../plugin');
const fs = require('fs');
const utils = require('../utils');
const args = require('../args');

let _running = false;

const _quietTime = 1500;

const watch0 = () => {
    const currentDir = process.cwd();

    if (!currentDir.endsWith('deploy')) {
        throw 'Watch can only be run from a plugin deploy directory';
    }

    if (args.getInitBundle()) {
        console.log(`Initializing watch - bundling plugin`);
        changeDetected(currentDir);
    }

    console.log(`Watching ${currentDir} for changes`);

    fs.watch(currentDir, (event, filename) => {
        changeDetected(currentDir);
    })

}

const changeDetected = async (currentDir) => {
    if (_running) {
        return;
    }
    _running = true;

    //set some quiet time to make sure large file copies are fulling complete
    await utils.sleep(_quietTime);

    pluginDir = utils.getParentFile(currentDir);
    console.log('Change detected, making plugin from ', pluginDir);
    try {
        const jarPath = await plugin.makePlugin(pluginDir);
        console.log('Bundled plugin ', jarPath);

        if(args.isUpload()) {
            utils.uploadJar(jarPath, args.getUploadDir());
            const jarName = jarPath.split('\\').pop();
            console.log(`Copied ${jarName} to ${args.getUploadDir()}... waiting for upload verification...`);
            confirmUpload(args.getUploadDir(), jarName);
        }
        

        setTimeout(() => {
            _running = false;
        }, 1000);
    }
    catch(err) {
        console.error(err);
    }
}

const confirmUpload = (targetDirectory, jarName) => {
    
    let waitingLog = setInterval(() => {
        console.log('.');
    },5000)

    let uploadWatcher = fs.watch(targetDirectory, (event, filename) => {
        if(filename == jarName) {
            console.log(`Uploaded ${jarName} to FlexDeploy!`);
            uploadWatcher.close();
            clearInterval(waitingLog);
        }
    })

    
}

module.exports = {
    watch: watch0
}
