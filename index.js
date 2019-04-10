const express = require('express');
const bodyParser = require('body-parser');

const getSession = require('./server/session.js');
const pg = require('./database/query.js');
const google = require('./server/google.js');

const app = express();
const port = 4000;

app.use(express.static('client/dist'));
app.use(bodyParser.json());
app.use(getSession());

app.get('/', (req, res) => {
  pg.hasToken(req.sessionID, (token) => {
    if (token) {
      res.sendFile(__dirname + '/client/dist/app.html');
    } else {
      google.authorize(res);
    }
  });
});

//recieve google's redirect
app.get('/googAutherized', (req, res) => {
  const { code } = req.query;
  //generate a token
  google.generateToken(code, (token) => {
    //retrieve google's id for user

    google.getUserInfo(token, ({ data }) => {
      //save user to DB
      pg.saveUser(data.id, token.access_token, req.sessionID, () => {
        res.redirect('/');
      });
    });
  });
});

app.get('/getGoogleData', (req, res) => {
  google.getData(req.sessionID, (data) => {
    res.send(data);
  });
});

app.get('/refreshContactList', (req, res) => {});

app.listen(port, console.log('Listening on localhost:', port));
