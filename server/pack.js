
const paths = require('../config/paths');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

//  RESTful API
app.use(bodyParser.json({ type: 'application/json' }))
app.use(express.static(paths.appPublic));
const main = require('./main');
try {
    main(app);
} catch (err) {
    console.log(err);
    main(app);
}
const port = 32087;

app.listen(port, function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Server running on port ' + port);
});    
