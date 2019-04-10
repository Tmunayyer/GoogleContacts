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
  dbHelpers.hasToken(req.sessionID, (token) => {
    if (token) {
      res.sendFile(__dirname + '/client/dist/app.html');
    } else {
      googHelpers.authorize(res);
    }
  });
});

//recieve google's redirect
app.get('/googAutherized', (req, res) => {
  const { code } = req.query;
  //generate a token
  googHelpers.generateToken(code, (token) => {
    //save refresh token
    dbHelpers.saveUser(token.access_token, req.sessionID, () => {
      res.redirect('/');
    });
  });
});

app.get('/getGoogleData', (req, res) => {
  googHelpers.getData(req.sessionID, (data) => {
    res.send(data);
  });
});

app.listen(port, console.log('Listening on localhost:', port));
