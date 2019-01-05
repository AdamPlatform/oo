const publicPath = '/';
const paths = require('../config/paths');
// this is necessary to handle URL correctly since client uses Browser History
//http协议模块
var http = require('http');
//url解析模块
var url = require('url');
//文件系统模块
var fs = require("fs");
//路径解析模块
var path = require("path");
console.log('main run');
/**
 * 获取文档的内容类型
 * @param filePath
 * @returns {*}
 */
const getContentType = function (filePath) {

    var contentType = config.mime;
    var ext = path.extname(filePath).substr(1);
    if (contentType.hasOwnProperty(ext)) {
        return contentType[ext];
    } else {
        return contentType.default;
    }
}

///配置信息
const config = {
    port: 52491,
    ip: '127.0.0.1',
    mime: {
        html: "text/html",
        js: "text/javascript",
        css: "text/css",
        gif: "image/gif",
        jpg: "image/jpeg",
        png: "image/png",
        ico: "image/icon",
        txt: "text/plain",
        json: "application/json",
        default: "application/octet-stream"
    }
}
module.exports = function (app) {
    console.log(app.path, 'app');
    const log4js = require('log4js');
    log4js.configure({
        appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
        categories: { default: { appenders: ['cheese'], level: 'trace' } }
    });
    const logger = log4js.getLogger('cheese');
    app.all('*', function (req, res, next) {
        //logger.info(JSON.stringify(req));
        //logger.info(JSON.stringify(res));
        res.header("Cache-Control", "no-cache");
        res.header("Access-Control-Allow-Origin", "*");
        //res.header("Access-Control-Allow-Origin", "http://localhost:8000");//不用*是因为Access-Control-Allow-Credentials需要指定具体的
        //特别注意: 给一个带有withCredentials的请求发送响应的时候,服务器端必须指定允许请求的域名,
        // 不能使用'*'.上面这个例子中,如果响应头是这样的:Access-Control-Allow-Origin: * ,则响应会失败.
        // 在这个例子里,因为Access-Control-Allow-Origin的值是http://foo.example这个指定的请求域名,
        // 所以服务器端把带有凭证信息的内容返回给了客户端. 另外注意第22行,更多的cookie信息也被创建了.
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("X-Powered-By", ' 3.2.1');
        //if (req.method == "OPTIONS") {
            //让options请求快速返回
            //res.sendStatus(200);
        //}
        next();
    }); 

    app.get(/\/oo.*/, function (req, res) {
        //logger.info(JSON.stringify(req), '* req, res, next');
        //logger.info(JSON.stringify(res)); 
        console.log(req.path + ' get oo');
        logger.info(JSON.stringify({
            baseUrl: req.baseUrl,
            body: req.body,
            cookies: req.cookies,
            fresh: req.fresh,
            hostname: req.hostname,
            ip: req.ip,
            ips: req.ips,
            originalUrl: req.originalUrl,
            params: req.params,
            path: req.path,
            protocol: req.protocol,
            query: req.query,
            route: req.route,
            secure: req.secure,
            signedCookies: req.signedCookies,
            stale: req.stale,
            subdomains: req.subdomains,
            xhr: req.xhr
        }));
        res.sendFile(path.resolve(paths.appPublic, '', 'main.html'))
    })
    require('./platform_config/api')(app);
    require('./db_config/api')(app);
}

