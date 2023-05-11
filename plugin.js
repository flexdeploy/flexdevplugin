const fs = require('fs');
const utils = require('./utils');
const xml2js = require('xml2js');
const extract = require('extract-zip');
const cmd = require('node-cmd');
const args = require('./args');

var _pluginTempDir;
var _pluginDir;
var _pluginName;

const makePlugin0 = async (pluginDirectory, version) => {
    _pluginDir = pluginDirectory;
    _pluginName = pluginDirectory.split('\\').pop();
    _pluginTempDir = makePluginTempDir();
    
    await copyAndUpdatePluginXML(version);
    copyMasterProperties();
    copySetupScripts();
    copyFileTypes();
    await copyAndExtractLib();
    copyPluginJar();

    return makeJar();
}

const makePluginTempDir = () => {
    console.log('Making Temp Directory');
    const tempDir = _pluginDir + '\\deploy\\temp';
    utils.safeMakeDir(tempDir);
    utils.safeMakeDir(tempDir + '\\bin');
    utils.safeMakeDir(tempDir + '\\lib');
    utils.safeMakeDir(tempDir + '\\properties');
    return tempDir;
}

const copyAndUpdatePluginXML = async (version) => {
    const tempPluginXML = _pluginTempDir + '\\plugin.xml';
    fs.copyFileSync(_pluginDir + "\\plugin\\plugin.xml", tempPluginXML);

    let xmlData = fs.readFileSync(tempPluginXML, 'utf-8');

    let result = await xml2js.parseStringPromise(xmlData);

    const newVersion = version || args.getVersionPrefix() + Date.now();
    result.PluginDefinition.Version[0] = newVersion;
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(result);

    fs.writeFileSync(tempPluginXML, xml);
    console.log(`Updated plugin xml version to ${newVersion}`);
}

const copyMasterProperties = () => {
    const pluginsDir = utils.getParentFile(_pluginDir);
    const masterProps = utils.getChildFile(pluginsDir, 'FlexDeployPluginCore\\plugin\\properties\\master\\FD_MASTER_PROPERTY_LISTING.xml');

    fs.copyFileSync(masterProps, _pluginTempDir + "\\properties\\FD_MASTER_PROPERTY_LISTING.xml");
    console.log('Copied FD_MASTER_PROPERTY_LISTING.xml');
}

const copyFileTypes = () => {
    const fileTypesDir = utils.getChildFile(_pluginDir, 'plugin\\filetypes');
    
    if(fs.existsSync(fileTypesDir))
    {
        fs.cpSync(fileTypesDir, _pluginTempDir + "\\filetypes");
    }
    
    console.log('Copied filetypes');
}

const copySetupScripts = () => {
    const setupSh = utils.getChildFile(_pluginDir, 'plugin\\bin\\setup.sh');
    const setupBat = utils.getChildFile(_pluginDir, 'plugin\\bin\\setup.bat');

    if (fs.existsSync(setupSh)) {
        fs.copyFileSync(setupSh, _pluginTempDir + '\\bin\\setup.sh');
    }
    if (fs.existsSync(setupBat)) {
        fs.copyFileSync(setupBat, _pluginTempDir + '\\bin\\setup.bat');
    }

    console.log('Copied setup.sh and setup.bat');
}

const copyAndExtractLib = async () => {
    const libJar = utils.getChildFile(_pluginDir, 'deploy\\lib.jar');
    const tempLibJar = utils.getChildFile(_pluginTempDir, 'lib\\lib.jar');
    if (fs.existsSync(libJar)) {
        try {
            fs.copyFileSync(libJar, tempLibJar);
            await extract(tempLibJar, { dir: utils.getParentFile(tempLibJar),  });
            console.log('removing', tempLibJar);
            fs.unlinkSync(tempLibJar);
            fs.unlinkSync(libJar);

            console.log('Copied and extracted lib.jar');
        }
        catch (err) {
            console.error(err);
        }
    }
    else {
        console.log('No lib.jar found. You may need to deploy it.');
    }
}

const copyPluginJar = () => {
    const pluginJar = utils.getChildFile(_pluginDir, `deploy\\${_pluginName}.jar`);
    if (fs.existsSync(pluginJar)) {
        try {
            fs.copyFileSync(pluginJar, `${_pluginTempDir}\\lib\\${_pluginName}.jar`);
            fs.unlinkSync(pluginJar);
        }
        catch (err) {
            console.error(err);
        }

        console.log('Copied plugin jar');
    }
}

const makeJar = () => {
    cmd.runSync(`cd ${_pluginTempDir} & jar -cvfM0 ${_pluginName}.jar *`);
    return `${_pluginTempDir}\\${_pluginName}.jar`;
}

module.exports = {
    makePlugin: makePlugin0
}