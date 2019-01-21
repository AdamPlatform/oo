/**
 * 模块管理接口（后端）
 */
module.exports = (app) => {
    let dbo = require('./dbo.js');
    // 新增
    app.post('/table', (req, res) => {
        dbo.addTable(req.body).then(data => {
            res.send(data);
        }, error => {
            res.status(400).send(error);
        });
    });
    // 删除
    app.delete('/table', (req, res) => {
        if (req.query == null || req.query._id == null) {
            res.status(400).send('id不能为空')
        }
        dbo.deleteTalbe(req.query._id).then(data => {
            res.send(data);
        }, error => {
            res.status(400).send(error);
        })
    });
    // 更新
    app.put('/table', (req, res) => {
        if (req.query == null || req.query._id == null) {
            res.status(400).send('id不能为空')
        }
        dbo.updateTalbe(req.query._id, req.body).then(data => {
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
};
