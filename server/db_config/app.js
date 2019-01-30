/**
 * 模块管理接口（后端）
 */
module.exports = (app) => {
    let dbo = require('./dbo.js');

    // 新增
    app.post('/table', (req, res) => {
        dbo.addTable(req.body).then(data => {
            res.send(data);
            require('../module/app')(app);
        }, error => {
            res.status(400).send(error);
        });
    });

    // 删除
    app.delete('/table', (req, res) => {
        if (req.query == null || req.query.id == null) {
            res.status(400).send('id不能为空')
        }
        dbo.deleteTalbe(req.query.id).then(data => {
            res.send(data);
            require('../module/app')(app);
        }, error => {
            res.status(400).send(error);
        })
    });

    // 更新
    app.put('/table', (req, res) => {
        if (req.query == null || req.query.id == null) {
            res.status(400).send('id不能为空');
            require('../module/app')(app);
        }
        dbo.updateTalbe(req.query.id, req.body).then(data => {
            res.send(data);
        }, error => {
            res.status(400).send(error);
        });
    });

    // 查询列表
    app.put('/table_list', (req, res) => {
        dbo.getTables(req.body).then(data => {
            res.send(data);
        }, error => {
            res.status(400).send(error);
        });
    });

    // 查询单个
    app.get('/table', (req, res) => {
        dbo.getOne(req.query.id).then(data => {
            res.send(data);
        }, error => {
            res.status(400).send(error);
        });
    });

    // 新增配置字段
    app.post('/table_field', (req, res) => {
        dbo.addField(req.query.id, req.query.num).then(() => {
            res.send(null);
        }, error => {
            res.status(400).send(error);
        });
    });

    // 删除一个配置字段
    app.delete('/table_field', (req, res) => {
        dbo.delOneField(req.query.id, req.query.dataIndex).then(() => {
            res.send(null);
            require('../module/app')(app);
        }, error => {
            res.status(400).send(error);
        });
    });

    // 修改一个配置字段
    app.put('/table_field', (req, res) => {
        dbo.modifyOneField(req.query.id, req.query.record).then(() => {
            res.send(null);
            require('../module/app')(app);
        }, error => {
            res.status(400).send(error);
        });
    });

    // 上移一个配置字段
    app.put('/table_field/up', (req, res) => {
        dbo.fieldUp(req.query.id, req.query.dataIndex).then(() => {
            res.send(null);
        }, error => {
            res.status(400).send(error);
        });
    });

    // 上移一个配置字段
    app.put('/table_field/down', (req, res) => {
        dbo.fieldDown(req.query.id, req.query.dataIndex).then(() => {
            res.send(null);
        }, error => {
            res.status(400).send(error);
        });
    });

    // 上移一个配置字段至顶部
    app.put('/table_field/up_top', (req, res) => {
        dbo.fieldUpToTop(req.query.id, req.query.dataIndex).then(() => {
            res.send(null);
        }, error => {
            res.status(400).send(error);
        });
    });

    // 上移一个配置字段至底部
    app.put('/table_field/down_bottom', (req, res) => {
        dbo.fieldDownToBottom(req.query.id, req.query.dataIndex).then(() => {
            res.send(null);
        }, error => {
            res.status(400).send(error);
        });
    });
};
