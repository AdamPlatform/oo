/**
 * 模块管理数据库操作
 * 线型模型
 */
let Q = require('q');
let {connect} = require('../database');
let ObjectId = require('mongodb').ObjectId;
let {generateSql} = require('../utils');
module.exports = {
    /**
     * 新增
     */
    add: (record, moudleConfig) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
            record[`${record.tableName}_createdAt`] = new Date();
            record[`${record.tableName}_modifiedAt`] = new Date();
            let fields_config = moudleConfig.fields_config || [];
            // 获取配置中的唯一字段
            let uniqueFields = fields_config.filter(item => item.isUnique === '1');
            // 唯一字段查询条件
            let orQuery = {$or: []};
            // 唯一字段名称数组
            let uniqueNameArr = [];
            for (let config of uniqueFields) {
                let dataIndex = config.dataIndex;
                let value = record[dataIndex] || '';
                if (value !== '') {
                    orQuery.$or.push({[dataIndex]: value});
                    uniqueNameArr.push(config.name);
                }
            }
            let uniqueNamesStr = uniqueNameArr.join('或');
            if (orQuery.$or.length > 0) {
                // 查询唯一字段是否重复
                collection.count(orQuery, {}, (error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
                        db.close();
                        return;
                    }

                    if (result > 0) {
                        defer.reject({message: `${uniqueNamesStr}已存在，请检查`});
                        db.close();
                        return;
                    }

                    // 插入一条数据
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
            } else {
                // 插入一条数据
                collection.insertOne(record, null, (error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
                        db.close();
                        return;
                    }
                    defer.resolve(record);
                    db.close();
                });
            }
        });
        return defer.promise;
    },

    /**
     * 删除
     */
    delete: (_id, moudleConfig) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
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
    update: (_id, record, moudleConfig) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
            record[`${record.tableName}_modifiedAt`] = new Date();
            collection.findOne({_id: ObjectId(_id)}, {}, (error, doc) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                let fields_config = moudleConfig.fields_config || [];
                // 获取配置中的唯一字段
                let uniqueFields = fields_config.filter(item => item.isUnique === '1');
                // 唯一字段查询条件
                let orQuery = {$or: []};
                // 唯一字段名称数组
                let uniqueNameArr = [];
                for (let config of uniqueFields) {
                    let dataIndex = config.dataIndex;
                    let value = record[dataIndex] || '';
                    if (value !== '' && value !== doc[dataIndex]) {
                        orQuery.$or.push({[dataIndex]: value});
                        uniqueNameArr.push(config.name);
                    }
                }
                let uniqueNamesStr = uniqueNameArr.join('或')
                if (orQuery.$or.length > 0) {
                    // 查询唯一字段是否重复
                    collection.count(orQuery, {}, (error, result) => {
                        if (error && error.message) {
                            defer.reject(error);
                            db.close();
                            return;
                        }

                        if (result > 0) {
                            defer.reject({message: `${uniqueNamesStr}已存在，请检查`});
                            db.close();
                            return;
                        } 

                        // 更新数据
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
                } else {
                    // 更新数据
                    collection.updateOne({_id: ObjectId(_id)}, {$set: record}, null, (error, result) => {
                        if (error && error.message) {
                            defer.reject(error);
                            db.close();
                            return;
                        }
                        defer.resolve({});
                        db.close();
                    });    
                }
            });
        });
        return defer.promise;
    },

    /**
     * 查询列表
     */
    getList: (data, moudleConfig) => {
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
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
            let findCond = generateSql(query);
            let cursor = collection.find(findCond).collation({locale: "zh"});
            let totalElements = 0;
            cursor.count((error, result) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
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
    },

    /**
     * 获取单个表格配置
     */
    getOne: (_id, moudleConfig) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
            collection.findOne({_id: ObjectId(_id)}, {}, (error, doc) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                defer.resolve(doc);
            });        
        });
        return defer.promise;
    },

    /**
     * 删除树节点
     */
    deleteTreeNode: (_id, moudleConfig) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
            collection.findOne({_id: ObjectId(_id)}, {}, (error, doc) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }

                if (doc[`${record.tableName}_pid`] === null) {
                    defer.reject({message: "根节点不能删除"});
                    db.close();
                    return;
                }

                collection.find({[`${record.tableName}_pid`]: _id}).count((error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
                        db.close();
                        return;
                    }
    
                    if (result > 0) {
                        defer.reject({message: "该节点存在子节点，不能删除"});
                        db.close();
                        return;
                    } 
    
                    collection.deleteMany({_id: ObjectId(_id)}, null, (error, result) => {
                        if (error && error.message) {
                            defer.reject(error);
                            db.close();
                            return;
                        }
                        defer.resolve(null);
                        db.close();
                    });
                })
            });  
            
        });
        return defer.promise;
    },

    /**
     * 查询树
     */
    getTree: (moudleConfig) => {

    }
};