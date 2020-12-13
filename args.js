let _uploadDir;
let _upload = false;
let _versionPrefix;
let _command;
let _initBundle;

module.exports = {
    setArgs: args => {
        _command = args._[0];
        _upload = args.upload;
        _versionPrefix = args.prefix;
        _uploadDir = args['upload-dir'] || process.env.FDPLG_UPLOAD_DIR;
        _initBundle = args['init-bundle'];
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
    getInitBundle: () => {
        return !!_initBundle;
    },
    getCommand: () => {
        return _command;
    }
}