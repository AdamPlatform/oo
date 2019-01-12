let Q = require('q');
let {connect} = require('../database');
let uuid = require('uuid/v1');
let ObjectId = require('mongodb').ObjectId ;
const moment = require('moment');
module.exports = {
    addTable: (record) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection("tables_config");
            record.createdAt = new Date();
            let id = ObjectId();
            record.tableName = `t${id}`;
            let moduleName = record.moduleName;
            if (moduleName === null || moduleName === undefined) {
                defer.reject({message: "模块名称不能为空"});
                db.close();
                return;
            }
            collection.count({moduleName: moduleName}, {}, (error, result) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                if (result > 0) {
                    defer.reject({message: "模块名称已存在，请重新命名"});
                    db.close();
                    return;
                }

                collection.insertOne(record, {}, (error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
                        db.close();
                        return;
                    }
                    defer.resolve(record);
                    db.close();
                });
            });
        });
        return defer.promise;
    },

    deleteTalbe: (_id) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.deleteMany({_id: ObjectId(_id)}, null, (error, result) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                defer.resolve(null);
                db.close();
            });
        });
        return defer.promise;
    },

    updateTalbe: (_id, record) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.updateOne({_id: ObjectId(_id)}, record, null, (error, result) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                defer.resolve({});
                db.close();
            });        
        });
        return defer.promise;
    },

    getTables: () => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.find().toArray().then(docs => {
                defer.resolve(docs);  
                db.close();       
            });
        });
        return defer.promise;
    }
};