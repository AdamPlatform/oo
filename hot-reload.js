'use strict'

const path = require('path');

const cp = require('child_process');

const chokidar = require('chokidar');

const watcher = chokidar.watch(path.join(__dirname, '/server'));

let appIns = cp.fork(path.join(__dirname, '/server/pack.js'));

watcher.on('ready', () => {

        watcher.on('change', (path) => {

                console.log('<---- watched file change, do something ---->');

                appIns = reload(appIns);

        });

        watcher.on('add', (path) => {

                console.log('<---- watched new file add, do something ---->');

                appIns = reload(appIns);

        });

        watcher.on('unlink', (path) => {

                console.log('<---- watched file remove, do something ---->');

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