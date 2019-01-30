/**
 * 根据系统配置生成模块接口（后端）
 */
module.exports = (app) => {
    let dbo = require('./dbo.js');
    let {connect} = require('../database');
    let listApi = (app, tableName, moudleConfig) => {
        // 新增
        app.post(`/${tableName}`, (req, res) => {
            dbo.add(req.body, moudleConfig).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 删除
        app.delete(`/${tableName}`, (req, res) => {
            if (req.query == null || req.query._id == null) {
                res.status(400).send('id不能为空')
            }
            dbo.delete(req.query._id, moudleConfig).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            })
        });

        // 更新
        app.put(`/${tableName}`, (req, res) => {
            if (req.query == null || req.query._id == null) {
                res.status(400).send('id不能为空')
            }
            dbo.update(req.query._id, req.body, moudleConfig).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 查询列表
        app.put(`/${tableName}/list`, (req, res) => {
            dbo.getList(req.body, moudleConfig).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 查询单个
        app.get(`/${tableName}`, (req, res) => {
            dbo.getOne(req.query._id, moudleConfig).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });
    };

    let treeApi = (app, tableName, moudleConfig) => {
        // 新增
        app.post(`/${tableName}`, (req, res) => {
            dbo.add(req.body, moudleConfig).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 删除
        app.delete(`/${tableName}`, (req, res) => {
            if (req.query == null || req.query._id == null) {
                res.status(400).send('id不能为空')
            }
            dbo.deleteTreeNode(req.query._id, moudleConfig).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            })
        });

        // 更新
        app.put(`/${tableName}`, (req, res) => {
            if (req.query == null || req.query._id == null) {
                res.status(400).send('id不能为空')
            }
            dbo.update(req.query._id, req.body, moudleConfig).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 查询树
        app.put(`/${tableName}/tree`, (req, res) => {
            dbo.getTree(moudleConfig).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 查询单个
        app.get(`/${tableName}`, (req, res) => {
            dbo.getOne(req.query._id, moudleConfig).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });
    };
    connect(db => {
        let oo = db.db('oo');
        let collection = oo.collection("tables_config");
        collection.find({}).toArray().then(list => {
            list.forEach(moudleConfig => {
                let tableName = moudleConfig.tableName;
                if (moudleConfig.dataMoudle === '树') {
                    treeApi(app, tableName, moudleConfig)
                } else {
                    listApi(app, tableName, moudleConfig)
                }
            })
        }); 
    });
};
