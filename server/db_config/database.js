var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://adam:123456gqh@cluster0-shard-00-00-qeluk.mongodb.net:27017,cluster0-shard-00-01-qeluk.mongodb.net:27017,cluster0-shard-00-02-qeluk.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

module.exports = {
    query: (dbOper) => {  
        MongoClient.connect(uri, (err, db) => {
            dbOper(db);
            db.close();
        });
    }
};  