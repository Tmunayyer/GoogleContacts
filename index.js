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
  //pass response incase of failure
  google.getData(req.sessionID, (err, data) => {
    if (err) {
      if (err.errors[0].message === 'Invalid Credentials') {
        //reauthorize
        //this is not working for some reason because of cors
        // i know this is a problem i dont know how to fix it
        google.authorize(res);
      } else {
        return console.log('Error getting google people data:', err);
      }
    } else {
      res.send(data);
    }
  });
});

app.get('/appData', (req, res) => {
  pg.getComments(req.sessionID, (err, data) => {
    if (err) {
      res.send('We made a mistake!');
      console.log('Error getting comments:', err);
    } else {
      if (data.length === 0) {
        //scenario 1 = new user, need to get contacts from google
        google.getData(req.sessionID, (err, googleData) => {
          if (err) return console.log('problem getting data from google:', err);
          //save this data to the DB

          pg.saveContacts(req.sessionID, googleData, (err, result) => {
            //restart this process with saved contacts
            if (err) {
              res.send('Error saving contacts');
              console.log('Error saving contacts:', err);
            } else {
              res.redirect('/appData');
            }
          });
        });
      } else {
        res.send(data);
      }
    }
  });
});

app.get('/refreshContactList', (req, res) => {});

app.listen(port, console.log('Listening on localhost:', port));
