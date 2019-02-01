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
            record[`${moudleConfig.tableName}_id`] = ObjectId().toString();
            record[`${moudleConfig.tableName}_createdAt`] = new Date();
            record[`${moudleConfig.tableName}_modifiedAt`] = new Date();
            let fields_config = moudleConfig.fields_config || [];
            // 获取配置中的唯一字段
            let uniqueFields = fields_config.filter(
                item => item.isUnique === '1' && 
                [`${moudleConfig.tableName}_createdAt`, `${moudleConfig.tableName}_modifiedAt`].indexOf(item.dataIndex
            ) === -1);
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
                collection.count(orQuery, {}, (err, result) => {
                    if (err) {
                        defer.reject(err);
                        db.close();
                        return;
                    }

                    if (result > 0) {
                        defer.reject({message: `${uniqueNamesStr}已存在，请检查`});
                        db.close();
                        return;
                    }

                    // 插入一条数据
                    collection.insertOne(record, null, (err, result) => {
                        if (err) {
                            defer.reject(err);
                            db.close();
                            return;
                        }
                        defer.resolve(record);
                        db.close();
                    });
                });
            } else {
                // 插入一条数据
                collection.insertOne(record, null, (err, result) => {
                    if (err) {
                        defer.reject(err);
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
    delete: (id, moudleConfig) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
            collection.deleteMany({[`${moudleConfig.tableName}_id`]: id}, null, (err, result) => {
                if (err) {
                    defer.reject(err);
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
    update: (id, record, moudleConfig) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
            record[`${moudleConfig.tableName}_modifiedAt`] = new Date();
            collection.findOne({[`${moudleConfig.tableName}_id`]: id}, {}, (err, doc) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }
                let fields_config = moudleConfig.fields_config || [];
                // 获取配置中的唯一字段
                let uniqueFields = fields_config.filter(
                    item => item.isUnique === '1' && 
                    [`${moudleConfig.tableName}_createdAt`, `${moudleConfig.tableName}_modifiedAt`].indexOf(item.dataIndex
                ) === -1);
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
                    collection.count(orQuery, {}, (err, result) => {
                        if (err) {
                            defer.reject(err);
                            db.close();
                            return;
                        }

                        if (result > 0) {
                            defer.reject({message: `${uniqueNamesStr}已存在，请检查`});
                            db.close();
                            return;
                        } 

                        // 更新数据
                        collection.updateOne({[`${moudleConfig.tableName}_id`]: id}, {$set: record}, null, (err, result) => {
                            if (err) {
                                defer.reject(err);
                                db.close();
                                return;
                            }
                            defer.resolve({});
                            db.close();
                        });    
                    });
                } else {
                    // 更新数据
                    collection.updateOne({[`${moudleConfig.tableName}_id`]: id}, {$set: record}, null, (err, result) => {
                        if (err) {
                            defer.reject(err);
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
        let sortField = {[`${moudleConfig.tableName}_createdAt`]: -1};
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
            cursor.count((err, result) => {
                if (err) {
                    defer.reject(err);
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
                    }, err => {
                        defer.reject(err);
                        db.close();
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
    getOne: (id, moudleConfig) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
            collection.findOne({[`${moudleConfig.tableName}_id`]: id}, {}, (err, doc) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }
                defer.resolve(doc);
            });        
        });
        return defer.promise;
    },

    /***************************************************************************
     * 数据模型树操作
     ***************************************************************************/

    /**
     * 新增树节点
     */
    addTreeNode: (pid, record, moudleConfig) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
            collection.findOne({[`${moudleConfig.tableName}_id`]: pid}, {}, (err, doc) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }
                if (null === doc) {
                    defer.reject({message: `未找到父节点，请联系管理员`});
                    db.close();
                }
                let newId = ObjectId().toString();
                record[`${moudleConfig.tableName}_levels`] = doc[`${moudleConfig.tableName}_levels`] + ',' + newId;
                record[`${moudleConfig.tableName}_id`] = newId;
                record[`${moudleConfig.tableName}_createdAt`] = new Date();
                record[`${moudleConfig.tableName}_modifiedAt`] = new Date();
                let fields_config = moudleConfig.fields_config || [];
                // 获取配置中的唯一字段
                let uniqueFields = fields_config.filter(
                    item => item.isUnique === '1' && 
                    [`${moudleConfig.tableName}_createdAt`, `${moudleConfig.tableName}_modifiedAt`].indexOf(item.dataIndex
                ) === -1);
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
                    collection.count(orQuery, {}, (err, result) => {
                        if (err) {
                            defer.reject(err);
                            db.close();
                            return;
                        }

                        if (result > 0) {
                            defer.reject({message: `${uniqueNamesStr}已存在，请检查`});
                            db.close();
                            return;
                        }

                        // 插入一条数据
                        collection.insertOne(record, null, (err, result) => {
                            if (err) {
                                defer.reject(err);
                                db.close();
                                return;
                            }
                            defer.resolve(record);
                            db.close();
                        });
                    });
                } else {
                    // 插入一条数据
                    collection.insertOne(record, null, (err, result) => {
                        if (err) {
                            defer.reject(err);
                            db.close();
                            return;
                        }
                        defer.resolve(record);
                        db.close();
                    });
                }
            }); 
        });
        return defer.promise;
    },

    /**
     * 删除树节点
     */
    deleteTreeNode: (id, moudleConfig) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moudleConfig.tableName}`);
            collection.findOne({[`${moudleConfig.tableName}_id`]: id}, {}, (err, doc) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }

                if (doc[`${moudleConfig.tableName}_pid`] === null) {
                    defer.reject({message: "根节点不能删除"});
                    db.close();
                    return;
                }

                collection.find({[`${moudleConfig.tableName}_pid`]: id}).count((err, result) => {
                    if (err) {
                        defer.reject(err);
                        db.close();
                        return;
                    }
    
                    if (result > 0) {
                        defer.reject({message: "该节点存在子节点，不能删除"});
                        db.close();
                        return;
                    } 
    
                    collection.deleteMany({[`${moudleConfig.tableName}_id`]: id}, null, (err, result) => {
                        if (err) {
                            defer.reject(err);
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
        let defer = Q.defer();
        connect(db => {
            let tableName = moudleConfig.tableName;
            const collection = db.db("oo").collection(`${tableName}`);
            collection.find({}).toArray((err, docs) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }
                let rootNodes = docs.filter(doc => doc[`${tableName}_pid`] === null);
                let createTree = (docs, node) => {
                    if (node === null || node === undefined) {
                        return;
                    }
                    node.children = docs.filter(doc => doc[`${tableName}_pid`] === node[`${tableName}_id`]);
                    if (node.children.length === 0) {
                        delete node.children;
                    }
                    if (node.children === undefined) {
                        return;
                    }
                    for (let childNode of node.children) {
                        createTree(docs, childNode);
                    }
                }
                defer.resolve(rootNodes.map(rootNode => createTree(docs, rootNode)));
                db.close();
            })
        });
    }
};