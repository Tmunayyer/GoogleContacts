const express = require('express');
const bodyParser = require('body-parser');

const getSession = require('./server/session.js');
const dbHelpers = require('./database/query.js');
const googHelpers = require('./server/google.js');

const app = express();
const port = 4000;

app.use(express.static('client/dist'));
app.use(bodyParser.json());
app.use(getSession());

app.get('/', (req, res) => {
  dbHelpers.getAuth(req.sessionID, (err, auth) => {
    if (err) return res.send('We did something wrong! 500');
    if (auth) {
      res.sendFile(__dirname + '/client/dist/app.html');
    } else {
      googHelpers.authorize(res);
    }
  });
});

app.get('/googAutherized', (req, res) => {
  const { code } = req.query;
  //save code to the database
  dbHelpers.saveAuth(code, req.sessionID, () => {
    res.redirect('/');
  });
});

app.listen(port, console.log('Listening on localhost:', port));
