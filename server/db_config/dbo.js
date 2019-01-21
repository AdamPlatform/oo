/**
 * 模块管理数据库操作
 */
let Q = require('q');
let {connect} = require('../database');
let uuid = require('uuid/v1');
let ObjectId = require('mongodb').ObjectId ;
const moment = require('moment');
module.exports = {
    /**
     * 新增
     */
    addTable: (record) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection("tables_config");
            record.createdAt = new Date();
            record.modifiedAt = new Date();
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

                collection.insertOne(record, null, (error, result) => {
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

    /**
     * 删除
     */
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

    /**
     * 更新
     */
    updateTalbe: (_id, record) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            record.modifiedAt = new Date();
            collection.updateOne({_id: ObjectId(_id)}, {$set: record}, null, (error, result) => {
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

    /**
     * 查询列表
     */
    getTables: (data) => {
        let {page, pageSize, query, sorter} = data;
        let sortField = {createdAt: -1};
        if (sorter.field) {
            let order = sorter.order === 'ascend' ? 1 : -1
            sortField = {
                [sorter.field]: order
            }
        }
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            let cursor = collection.find(query).collation({locale: "zh"});
            let totalElements = 0;
            cursor.count((err, result) => {
                totalElements = result;
                cursor.sort(sortField)
                    .skip(page > 0 ? ( ( page - 1 ) * pageSize ) : 0)
                    .limit(pageSize)
                    .toArray().then(list => {
                    defer.resolve({
                        page, pageSize, totalElements, list
                    });  
                    db.close();       
                });
            });
            
        });
        return defer.promise;
    }
};