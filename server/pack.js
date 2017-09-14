// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

// Ensure environment variables are read.
require('../config/env');

const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
//const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
    createCompiler,
    prepareProxy,
    prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const config = require('../config/webpack.config.dev');
const createDevServerConfig = require('../config/webpackDevServer.config');
const express = require('express');
const bodyParser = require('body-parser');
const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;
const publicPath = '/';
// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
}

// Tools like Cloud9 rely on this.
const port = parseInt(process.env.PORT, 10) || 52491;
const HOST = process.env.HOST || '0.0.0.0';
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const appName = require(paths.appPackageJson).name;
const urls = prepareUrls(protocol, HOST, port);
// Create a webpack compiler that is configured with custom messages.
const compiler = createCompiler(webpack, config, appName, urls, useYarn);
// Load proxy config
const proxySetting = require(paths.appPackageJson).proxy;
const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
// Serve webpack assets generated by the compiler over a web sever.
const serverConfig = createDevServerConfig(
    proxyConfig,
    urls.lanUrlForConfig
);

const isDeveloping = process.env.NODE_ENV === 'development' || process.env.NODE_ENV == null;
const app = express();

// Webpack developer
if (isDeveloping) {
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: publicPath,
        noInfo: true
    }));
    app.use(require('webpack-hot-middleware')(compiler));
}

//  RESTful API
app.use(bodyParser.json({ type: 'application/json' }))
app.use(express.static(paths.appPublic));
const main = require('./main');
main(app);
app.listen(port, function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log(chalk.cyan('Server running on port ' + port));
    //openBrowser(urls.localUrlForBrowser);
});    
