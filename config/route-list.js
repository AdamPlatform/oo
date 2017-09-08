const Route = require('../src/Route');
const paths = require('./paths');
const RouteList = Object
    .values(Route)
    .reduce((obj, page) => {
        obj[page] = paths.appSrc + '/pages/' + page;
        return obj;
    }, {})
module.exports = RouteList;