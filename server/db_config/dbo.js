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
            record.fields_config = [{"dataIndex":`${record.tableName}_code`,"name":"编码","isShow":"1","isRequire":"1","disabled":"1","isQuery":"1","isSort":"1","width":160,"dataType":"STRING","isShowDisabled":"1","isRequireDisabled":"1","disabledDisabled":"1","isQueryDisabled":"1","dataTypeDisabled":"1"},
                {"dataIndex":`${record.tableName}_name`,"name":"名称","isShow":"1","isRequire":"0","disabled":"0","isQuery":"1","isSort":"1","width":160,"dataType":"STRING","isShowDisabled":"1","isRequireDisabled":"1","disabledDisabled":"1","isQueryDisabled":"1","dataTypeDisabled":"1"}]
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
    },

    /**
     * 获取单个表格配置
     */
    getOne: (_id) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
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
     * 新增配置字段
     */
    addField: (_id, num) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.findOne({_id: ObjectId(_id)}, {}, (error, doc) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                let fields_config = doc.fields_config || [];
                let startIndex = fields_config.length + 1;
                let fields = [];
                let total = parseInt(num);
                for (let i = 0; i < total; ++i) {
                    let dataIndex = ObjectId();
                    fields.push({"dataIndex":`${dataIndex}`,"name":`字段${startIndex + i}`,"isShow":"1","isRequire":"1","disabled":"1","isQuery":"1","isSort":"1","width":160,"dataType":"STRING"})
                }
                fields_config = fields_config.concat(fields);
                collection.updateOne({_id: ObjectId(_id)}, {$set: {fields_config: fields_config, modifiedAt: new Date()}}, null, (error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
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

    /**
     * 删除一个配置字段
     */
    delOneField: (_id, dataIndex) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.findOne({_id: ObjectId(_id)}, {}, (error, doc) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                let fields_config = doc.fields_config || [];
                fields_config = fields_config.filter(item => item.dataIndex !== dataIndex);
                collection.updateOne({_id: ObjectId(_id)}, {$set: {fields_config: fields_config, modifiedAt: new Date()}}, null, (error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
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
    
    /**
     * 修改一个配置字段
     */
    modifyOneField: (_id, record) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.findOne({_id: ObjectId(_id)}, {}, (error, doc) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                let fields_config = doc.fields_config || [];
                let index = fields_config.findIndex(item => item.dataIndex === record.dataIndex);
                if (index !== -1) {
                    fields_config[index] = Object.assign({}, fields_config[index], record);
                }
                collection.updateOne({_id: ObjectId(_id)}, {$set: {fields_config: fields_config, modifiedAt: new Date()}}, null, (error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
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

    /**
     * 上移一个配置字段
     */
    fieldUp: (_id, dataIndex) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.findOne({_id: ObjectId(_id)}, {}, (error, doc) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                let fields_config = doc.fields_config || [];
                let index = fields_config.findIndex(item => item.dataIndex === dataIndex);
                if (index > 0) {
                    [fields_config[index], fields_config[index - 1]] = [fields_config[index - 1], fields_config[index]]
                }
                collection.updateOne({_id: ObjectId(_id)}, {$set: {fields_config: fields_config, modifiedAt: new Date()}}, null, (error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
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

    /**
     * 下移一个配置字段
     */
    fieldDown: (_id, dataIndex) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.findOne({_id: ObjectId(_id)}, {}, (error, doc) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                let fields_config = doc.fields_config || [];
                let index = fields_config.findIndex(item => item.dataIndex === dataIndex);
                if (index < fields_config.length - 1) {
                    [fields_config[index], fields_config[index + 1]] = [fields_config[index + 1], fields_config[index]]
                }
                collection.updateOne({_id: ObjectId(_id)}, {$set: {fields_config: fields_config, modifiedAt: new Date()}}, null, (error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
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

    /**
     * 上移一个配置字段至顶部
     */
    fieldUpToTop: (_id, dataIndex) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.findOne({_id: ObjectId(_id)}, {}, (error, doc) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                let fields_config = doc.fields_config || [];
                let index = fields_config.findIndex(item => item.dataIndex === dataIndex);
                if (index > 1) {
                    let item = Object.assign({}, fields_config[index]);
                    fields_config.splice(index, 1);
                    fields_config.splice(2, 0, item);
                }
                collection.updateOne({_id: ObjectId(_id)}, {$set: {fields_config: fields_config, modifiedAt: new Date()}}, null, (error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
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

    /**
     * 下移一个配置字段至底部
     */
    fieldDownToBottom: (_id, dataIndex) => {
        let defer = Q.defer();
        connect(db => {
            let oo = db.db('oo');
            let collection = oo.collection("tables_config");
            collection.findOne({_id: ObjectId(_id)}, {}, (error, doc) => {
                if (error && error.message) {
                    defer.reject(error);
                    db.close();
                    return;
                }
                let fields_config = doc.fields_config || [];
                let index = fields_config.findIndex(item => item.dataIndex === dataIndex);
                if (index > 1) {
                    let item = Object.assign({}, fields_config[index]);
                    fields_config.splice(index, 1);
                    fields_config.push(item);
                }
                collection.updateOne({_id: ObjectId(_id)}, {$set: {fields_config: fields_config, modifiedAt: new Date()}}, null, (error, result) => {
                    if (error && error.message) {
                        defer.reject(error);
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
};