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
    add: (record, moduleName) => {
        let defer = Q.defer();
        connect(db => {
            db.db("oo").collection("tables_config").findOne({"模块名称": moduleName}, {}, (err, moudleConfig) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }
                const collection = db.db("oo").collection(`${moduleName}`);
                record[`${moduleName}_id`] = ObjectId().toString();
                record[`${moduleName}_创建时间`] = new Date();
                record[`${moduleName}_修改时间`] = new Date();
                let fields_config = moudleConfig.fields_config || [];
                // 获取配置中的唯一字段
                let uniqueFields = fields_config.filter(
                    item => item.isUnique === '1' && 
                    [`${moduleName}_创建时间`, `${moduleName}_修改时间`].indexOf(item.dataIndex) === -1
                );
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
     * 删除
     */
    delete: (id, moduleName) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moduleName}`);
            collection.deleteMany({[`${moduleName}_id`]: id}, null, (err, result) => {
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
    update: (id, record, moduleName) => {
        let defer = Q.defer();
        connect(db => {
            db.db("oo").collection("tables_config").findOne({"模块名称": moduleName}, {}, (err, moudleConfig) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }
                const collection = db.db("oo").collection(`${moduleName}`);
                record[`${moduleName}_修改时间`] = new Date();
                collection.findOne({[`${moduleName}_id`]: id}, {}, (err, doc) => {
                    if (err) {
                        defer.reject(err);
                        db.close();
                        return;
                    }
                    let fields_config = moudleConfig.fields_config || [];
                    // 获取配置中的唯一字段
                    let uniqueFields = fields_config.filter(
                        item => item.isUnique === '1' && 
                        [`${moduleName}_创建时间`, `${moduleName}_修改时间`].indexOf(item.dataIndex
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
                            collection.updateOne({[`${moduleName}_id`]: id}, {$set: record}, null, (err, result) => {
                                if (err) {
                                    defer.reject(err);
                                    db.close();
                                    return;
                                }
                                defer.resolve(Object.assign({}, doc, record));
                                db.close();
                            });    
                        });
                    } else {
                        // 更新数据
                        collection.updateOne({[`${moduleName}_id`]: id}, {$set: record}, null, (err, result) => {
                            if (err) {
                                defer.reject(err);
                                db.close();
                                return;
                            }
                            defer.resolve(Object.assign({}, doc, record));
                            db.close();
                        });    
                    }
                });
            });
        });
        return defer.promise;
    },

    /**
     * 查询列表
     */
    getList: (data, moduleName) => {
        let {page, pageSize, query, sorter} = data;
        let sortField = {[`${moduleName}_创建时间`]: -1};
        if (sorter.field) {
            let order = sorter.order === 'ascend' ? 1 : -1
            sortField = {
                [sorter.field]: order
            }
        }
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moduleName}`);
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
                if (0 === result) {
                    let list = [];
                    defer.resolve({
                        page, pageSize, totalElements, list
                    }); 
                } else {
                    cursor.sort(sortField)
                        .skip(page > 0 ? ( ( page - 1 ) * pageSize ) : 0)
                        .limit(pageSize)
                        .toArray().then(list => {
                        defer.resolve({
                            page, pageSize, totalElements, list
                        });  
                        db.close();       
                    }, err => {
                        defer.reject(err);
                        db.close();
                    });
                }
            });
        });
        return defer.promise;
    },

    /**
     * 根据id获取一条数据
     */
    getOne: (id, moduleName) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moduleName}`);
            collection.findOne({[`${moduleName}_id`]: id}, {}, (err, doc) => {
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

    /**
     * 导入数据
     */
    upload: (excelData, moduleName) => {
        let defer = Q.defer();
        connect(db => {
            db.db("oo").collection("tables_config").findOne({"模块名称": moduleName}, {}, (err, moudleConfig) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }
                let head = excelData[0];
                let fieldsArray = [];
                let fieldsConfigArray = [];
                if (head && head.length > 0) {
                    let fields_config = moudleConfig.fields_config || [];
                    for (let i = 0; i < head.length; ++i) {
                        let config = fields_config.find(item => {
                            let col = head[i] && head[i].trim() || '';
                            return item.name === col;
                        });

                        if (undefined === config) {
                            defer.reject({message: `excel表头中【${head[i]}】在系统中不存在`}); 
                            return;
                        } else {
                            fieldsArray.push(`${moduleName}_${head[i]}`);
                            fieldsConfigArray.push(config);
                        }
                    }
                } else {
                    defer.reject({message: `excel表头为空`}); 
                    return;
                }

                let recordArray = [];
                let now = new Date();
                const moment = require('moment');
                for (let i = 1; i < excelData.length; ++i) {
                    let record = {};
                    record[`${moduleName}_id`] = ObjectId().toString();
                    record[`${moduleName}_创建时间`] = now;
                    record[`${moduleName}_修改时间`] = now;
                    let rowData = excelData[i] || [];
                    for (let j = 0; j < rowData.length; ++j) {
                        let text = rowData[j] || '';
                        if (fieldsConfigArray[j].dataType === 'DATE') {
                            record[fieldsArray[j]] = text !== '' ? new Date(moment('1900-01-01 08:00:00').add(text - 2, 'days').valueOf()) : null;
                        } else if (fieldsConfigArray[j].dataType === 'TIME') {
                            record[fieldsArray[j]] = text !== '' ? new Date(moment(text, 'YYYY/MM/DD HH:mm:ss').valueOf()) : null;
                        } else {
                            record[fieldsArray[j]] = text;
                        }
                    }
                    recordArray.push(record);
                }
                // 批量插入数据
                const collection = db.db("oo").collection(`${moduleName}`);
                collection.insertMany(recordArray, null, (err, result) => {
                    if (err) {
                        defer.reject(err);
                        db.close();
                        return;
                    }
                    defer.resolve({});
                    db.close();
                }); 
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
    addTreeNode: (pid, record, moduleName) => {
        let defer = Q.defer();
        connect(db => {
            db.db("oo").collection("tables_config").findOne({"模块名称": moduleName}, {}, (err, moudleConfig) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }
            
                const collection = db.db("oo").collection(`${moduleName}`);
                collection.findOne({[`${moduleName}_id`]: pid}, {}, (err, doc) => {
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
                    record[`${moduleName}_分类层级`] = doc[`${moduleName}_分类层级`] + ',' + newId;
                    record[`${moduleName}_id`] = newId;
                    record[`${moduleName}_pid`] = pid;
                    record[`${moduleName}_创建时间`] = new Date();
                    record[`${moduleName}_修改时间`] = new Date();
                    let fields_config = moudleConfig.fields_config || [];
                    // 获取配置中的唯一字段
                    let uniqueFields = fields_config.filter(
                        item => item.isUnique === '1' && 
                        [`${moduleName}_创建时间`, `${moduleName}_修改时间`].indexOf(item.dataIndex
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
        });
        return defer.promise;
    },

    /**
     * 删除树节点
     */
    deleteTreeNode: (id, moduleName) => {
        let defer = Q.defer();
        connect(db => {
            const collection = db.db("oo").collection(`${moduleName}`);
            collection.findOne({[`${moduleName}_id`]: id}, {}, (err, doc) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }

                if (doc[`${moduleName}_pid`] === null) {
                    defer.reject({message: "根节点不能删除"});
                    db.close();
                    return;
                }

                collection.find({[`${moduleName}_pid`]: id}).count((err, result) => {
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
    
                    collection.deleteMany({[`${moduleName}_id`]: id}, null, (err, result) => {
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
    getTree: (moduleName) => {
        let defer = Q.defer();
        connect(db => {
            let moduleName = moduleName;
            const collection = db.db("oo").collection(`${moduleName}`);
            collection.find({}).toArray((err, docs) => {
                if (err) {
                    defer.reject(err);
                    db.close();
                    return;
                }
                let rootNodes = docs.filter(doc => doc[`${moduleName}_pid`] === null);
                let createTree = (docs, node) => {
                    if (node === null || node === undefined) {
                        return;
                    }
                    node.key = node[`${moduleName}_id`];
                    node.label = node[`${moduleName}_名称`];
                    node.children = docs.filter(doc => doc[`${moduleName}_pid`] === node[`${moduleName}_id`]);
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
                rootNodes.forEach(rootNode => createTree(docs, rootNode));
                defer.resolve(rootNodes);
                db.close();
            })
        });
        return defer.promise;
    }
};