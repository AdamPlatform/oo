let Q = require('q');
let conn = require('../database');
let uuid = require('uuid/v1');
const moment = require('moment');
module.exports = {
    addTable: (record) => {
        let defer = Q.defer();
        conn.query(db => {
            const collection = db.db("oo").collection("tables_config");
            //collection.find().count((err, count) => {
                
                record.createdAt = new Date();
                record.tableName = `t${uuid()}`;
                let moduleName = record.moduleName;
                if (moduleName === null || moduleName === undefined) {
                    defer.reject("模块名称不能为空");
                    return;
                }
                // collection.countDocuments({moduleName: moduleName}, {}, (error, result) => {
                //     console.log(error, result, 'addTable findOne');
                //     if (error && error.message) {
                //         defer.reject(error);
                //         return;
                //     }
                //     if (result > 0) {
                //         defer.reject("模块名称已存在，请重新命名");
                //         return;
                //     }

                    collection.insertOne(record, {}, (error, result) => {
                        //console.log(error, result, 'addTable insertOne');
                        if (error && error.message) {
                            defer.reject(error);
                            return;
                        }
                        defer.resolve(record);
                    });
                //});
            //});
        });
        return defer.promise;
    },

    deleteTalbe: (_id) => {
        let defer = Q.defer();
        conn.query(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.deleteOne({_id: _id}, null, (error, result) => {
                console.log(error, result, 'deleteTalbe deleteOne');
                if (error && error.message) {
                    defer.reject(error);
                    return;
                }
                defer.resolve(null);
            });
        });
        return defer.promise;
    },

    updateTalbe: (_id, data) => {
        let defer = Q.defer();
        conn.query(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.updateOne({_id: _id}, data, null, (error, result) => {
                console.log(error, result, 'updateTalbe updateOne');
                if (error && error.message) {
                    defer.reject(error);
                    return;
                }
                defer.resolve(data);
            });        
        });
        return defer.promise;
    },

    getTables: () => {
        let defer = Q.defer();
        conn.query(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.find().toArray().then(docs => {
                console.log(docs, 'getTalbe collection');
                defer.resolve(docs);         
            });
        });
        return defer.promise;
    }
};