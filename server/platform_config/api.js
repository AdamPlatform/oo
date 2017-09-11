
module.exports = (app) => {
    var query = require('./query.js');
    app.post('/auth/login', (req, res) => {
        query.login(req.body).then((data) => {
            res.status(200).send(data);
        }, () => {
            res.status(400).send({message:'登录失败.'});
        });
    });
};
