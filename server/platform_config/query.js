let Q = require('q');
let conn = require('./database');
let uuid = require('uuid/v1');
const moment = require('moment');

module.exports = {
    login: () => {
        let defer = Q.defer();
        
        defer.resolve({});                         
        //defer.reject();
        
        return defer.promise;
    }
};