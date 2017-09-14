'use strict'
const path = require('path');
const cp = require('child_process');
const chokidar = require('chokidar');
const watcher = chokidar.watch(path.join(__dirname, '/server'));
let appIns = cp.fork(path.join(__dirname, '/server/pack.js'));

watcher.on('ready', () => {
    watcher.on('change', (path) => {
        console.log(path + ' change');
        appIns = reload(appIns);
    });

    watcher.on('add', (path) => {
        console.log(path + ' add');
        appIns = reload(appIns);
    });

    watcher.on('unlink', (path) => {
        console.log(path + ' remove');
        appIns = reload(appIns);
    });
});
process.on('SIGINT', () => {
    process.exit(0);
});

function reload(appIns) {
    appIns.kill('SIGINT');
    return cp.fork(require('path').join(__dirname, '/server/pack.js'));
}