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

//homepage
app.get('/', (req, res) => {
  //if we have this user in the db
  pg.hasToken(req.sessionID, (token) => {
    if (token) {
      //send them application
      res.sendFile(__dirname + '/client/dist/app.html');
    } else {
      //send them to google to be authorized
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

//provide data on app load
app.get('/contacts', (req, res) => {
  //does the user have contacts in the DB?
  pg.getComments(req.sessionID, (err, data) => {
    if (err) {
      res.send('We made a mistake!');
      console.log('Error getting comments:', err);
    } else {
      //if we do not have ANY data in DB
      if (data.length === 0) {
        //get the data from the contacts
        google.getData(req.sessionID, (err, googleData) => {
          if (err) return console.log('problem getting data from google:', err);
          //save contact to the DB
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
        //send down saved contacts
        res.send(data);
      }
    }
  });
});

//responds to a button on the page to refresh contacts list
app.get('/refreshContactList', (req, res) => {});

//responds to button log the user out, remove authorization code from db
app.get('/logout', (req, res) => {});

//save comment in the DB to a contact
app.post('/contacts', (req, res) => {});

app.listen(port, console.log('Listening on localhost:', port));
