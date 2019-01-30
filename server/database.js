/**
 * 数据库连接
 */

var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://adam:123456gqh@cluster0-shard-00-00-qeluk.mongodb.net:27017,cluster0-shard-00-01-qeluk.mongodb.net:27017,cluster0-shard-00-02-qeluk.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

module.exports = {
    connect: (dbOper) => {  
        MongoClient.connect(uri, (err, db) => {
            if (err) {
                console.log(err, 'mongo error!');
                return;
            }
            if (db) {
                try {
                    dbOper && dbOper(db);
                } catch (error) {
                    console.log(error, 'server error-------------');
                    db.close();

                }
                
            }
        });
    }
};  