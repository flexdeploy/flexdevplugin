const fs = require('fs');

module.exports = {
    safeMakeDir: dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    },
    getParentFile: dir => {
        const dirParts = dir.split('\\');
        dirParts.pop();
        return dirParts.join('\\');
    },
    getChildFile: (parent, child) => {
        return `${parent}\\${child}`.replace('\\\\', '\\');
    },
    uploadJar: (jarPath, uploadDir) => {
        const jarName = jarPath.split('\\').pop();
        fs.copyFileSync(jarPath, `${uploadDir}\\${jarName}`);
    }

}