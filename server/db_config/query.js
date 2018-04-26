let Q = require('q');
let conn = require('./database');
let uuid = require('uuid/v1');
const moment = require('moment');

function mongoException(error, obj, db, func) {
    if (error) {
        console.log(error);
        db.close();
        return;
    }
    func && func(obj)
}
module.exports = {
    addTable: (body) => {
        let defer = Q.defer();
        conn.query(db => {
            let oo = db.db('oo');
            oo.collection("tables_config", null, (error, collection) => {
                console.log(error, collection, 'addTable collection');
                if (error && error.message) {
                    defer.reject(error);
                    return;
                }
                let name = body.name;
                if (name == null) {
                    defer.reject("模块名称不能为空");
                    return;
                }
                collection.findOne({name: name}, (error, result) => {
                    console.log(error, result, 'addTable findOne');
                    if (error && error.message) {
                        defer.reject(error);
                        return;
                    }
                    if (null !== result) {
                        defer.reject("模块名称已存在，请重新命名");
                        return;
                    }
                    collection.insertOne(body, null, (error, result) => {
                        console.log(error, result, 'addTable insertOne');
                        if (error && error.message) {
                            defer.reject(error);
                            return;
                        }
                        defer.resolve({status: 200, body: data});
                    });
                    
                });
            });
        });
        return defer.promise;
    },

    deleteTalbe: (id) => {
        let defer = Q.defer();
        conn.query(db => {
            let oo = db.db('oo');
            oo.collection("tables_config", null, (error, collection) => {
                console.log(error, collection, 'deleteTalbe collection');
                if (error && error.message) {
                    defer.reject(error);
                    return;
                }
                
                collection.deleteOne({_id: id}, null, (error, result) => {
                    console.log(error, result, 'deleteTalbe deleteOne');
                    if (error && error.message) {
                        defer.reject(error);
                        return;
                    }
                    defer.resolve({status: 200});
                });
            });
        });
        return defer.promise;
    },

    updateTalbe: (id, data) => {
        let defer = Q.defer();
        conn.query(db => {
            let oo = db.db('oo');
            oo.collection("tables_config", null, (error, collection) => {
                console.log(error, collection, 'updateTalbe collection');
                if (error && error.message) {
                    defer.reject(error);
                    return;
                }
               
                collection.updateOne({_id: id}, data, null, (error, result) => {
                    console.log(error, result, 'updateTalbe updateOne');
                    if (error && error.message) {
                        defer.reject(error);
                        return;
                    }
                    defer.resolve({status: 200, body: data});
                });        
            });
        });
        return defer.promise;
    },

    getTables: () => {
        let oo = db.db('oo');
        oo.collection("tables_config", null, (error, collection) => {
            console.log(error, collection, 'updateTalbe collection');
            if (error && error.message) {
                defer.reject(error);
                return;
            }
            let result = collection.find();
            defer.resolve({status: 200, body: result});            
        });
        return defer.promise;
    }
};