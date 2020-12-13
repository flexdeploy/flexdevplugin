let _uploadDir;
let _upload = false;
let _versionPrefix;
let _command;

module.exports = {
    setArgs: args => {
        _command = args._[0];
        _upload = args.upload;
        _versionPrefix = args.prefix;
        _uploadDir = args['upload-dir'] || process.env.FDPLG_UPLOAD_DIR;
    },
    getUploadDir: () => {
        return _uploadDir;
    },
    isUpload: () => {
        return !!_upload;
    },
    getVersionPrefix: () => {
        return _versionPrefix;
    },
    getCommand: () => {
        return _command;
    }
}