# flexdevplugin
An NPM utility to upload development plugins to a local FlexDeploy application.

## Prerequisites
* The java jar command must be available and on the path
* NPM must be installed

## Installing
```
npm install -g flexdevplugin
```

## Usage
Utility should always be run from the plugin **deploy** directory where you want to watch or bundle changes.
The first time running the utility from a plugin deploy directory you should ensure that both the lib.jar and plugin jar are deployed. This is only needed to create the initial plugin temp directory.
```
fdplg <command> [options]

A utility to build FlexDeploy development plugins

Commands:
  fdplg watch   Watches a plugin deploy directory for changes and uploads to
                local server.
  fdplg bundle  Bundles a development plugin.

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```
### Watch
```
fdplg watch

Watches a plugin deploy directory for changes and uploads to local server.

Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -d, --upload-dir  The auto uploads directory for your local FlexDeploy Server.
                    Also reads from FDPLG_UPLOAD_DIR env variable.
  -u, --upload      Whether the command should auto upload to the upload
                    directory. Used in conjunction with --upload-dir.
  -p, --prefix      The prefix to apply to the plugin version. Defaults to
                    FDPLG_                                   [default: "FDPLG_"]
  -i, --init-bundle Initialize the watch by bundling and then watching. Use
                    this if there is already a change you want to bundle.
```
### Bundle
```
fdplg bundle

Bundles a development plugin.

Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -d, --upload-dir  The auto uploads directory for your local FlexDeploy Server.
                    Also reads from FDPLG_UPLOAD_DIR env variable.
  -u, --upload      Whether the command should auto upload to the upload
                    directory. Used in conjunction with --upload-dir.
  -p, --prefix      The prefix to apply to the plugin version. Defaults to
                    FDPLG_                                   [default: "FDPLG_"]
```
## Sample Commands
Watch directory for plugin changes and upload bundled plugin to C:\TEMP\FD\Plugins
```
fdplg watch --upload --upload-dir=C:\TEMP\FD\Plugins
```
Watch directory for plugin changes and upload bundled plugin to FDPLG_UPLOAD_DIR environment variable
```
set FDPLG_UPLOAD_DIR=C:\TEMP\FD\Plugins
fdplg watch --upload
```
Bundle plugin with a different version prefix
```
fdplg bundle --prefix CUSTOM_
```
### OS Support
* Windows