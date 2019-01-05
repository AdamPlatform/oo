var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://adam:123456gqh@cluster0-shard-00-00-qeluk.mongodb.net:27017,cluster0-shard-00-01-qeluk.mongodb.net:27017,cluster0-shard-00-02-qeluk.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

function mongoException(err, obj, db, func) {
    if (err) {
        console.log(err);
        db.close();
        return;
    }
    func && func(obj)
}
MongoClient.connect(uri, (err, db) => {
    mongoException(err, db, db, (db) => {
        let oo = db.db('oo');
        oo.collection('user', null, (err, collection) => {
            mongoException(err, collection, db, (collection) => {
                let res = collection.find();
                res.toArray((err, result) => {
                    mongoException(err, result, db, (result) => {
                        console.log(result, 'user------------');
                        db.close();
                    });
                });
            })
            
        });
    });
});
module.exports = {
    query: (dbOper) => {  
        MongoClient.connect(uri, function(err, db) {
            dbOper(db);
            db.close();
        });
    }
};  