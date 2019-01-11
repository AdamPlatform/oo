
module.exports = (app) => {
    let query = require('./query.js');
    app.post('/table', (req, res) => {
        query.addTable(req.body).then(data => {
            res.send(data);
        }, error => {
            res.status(400).send(error);
        });
    });
    app.delete('/table', (req, res) => {
        if (req.query == null || req.query._id == null) {
            res.status(400).send('id不能为空')
        }
        query.deleteTalbe(req.query._id).then(data => {
            res.send(data);
        }, error => {
            res.status(400).send(error);
        })
    });
    app.put('/table', (req, res) => {
        if (req.query == null || req.query._id == null) {
            res.status(400).send('id不能为空')
        }
        query.updateTalbe(req.query._id, req.body).then(data => {
            res.send(data);
        }, error => {
            res.status(400).send(error);
        });
    });
    app.get('/table', (req, res) => {
        query.getTables().then(data => {
            res.send(data);
        }, error => {
            res.status(400).send(error);
        });
    });
};
