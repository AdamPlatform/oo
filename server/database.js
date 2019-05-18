
/**
 * 数据库连接
 */

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://adam:123456gqh@cluster0-shard-00-00-qeluk.mongodb.net:27017,cluster0-shard-00-01-qeluk.mongodb.net:27017,cluster0-shard-00-02-qeluk.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
if (process.env.LOCALDB === '1') {
    url = "mongodb://localhost:27017/";
}

console.log(process.env.LOCALDB, 'process.env.LOCALDB')

module.exports = {
    connect: (dbOper) => {  
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.log(err, 'mongo err!');
                return;
            }
            if (db) {
                try {
                    dbOper && dbOper(db);
                } catch (err) {
                    console.log(err, 'server err-------------');
                    db.close();

                }
            }
        });
    }
};  