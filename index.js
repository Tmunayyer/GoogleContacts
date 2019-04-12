//modules
const express = require('express');
const bodyParser = require('body-parser');

//helpers
const getSession = require('./server/session.js');
const pg = require('./database/query.js');
const google = require('./server/google.js');

const app = express();
const port = 4000;

//middlewear
app.use(express.static('client/dist'));
app.use(bodyParser.json());
app.use(getSession());

//homepage
app.get('/', (req, res) => {
  //if we have this user in the db
  pg.hasToken(req.sessionID, (err, token) => {
    if (err) {
      console.log('Error retrieving token from DB:', err);
      res.status(500);
      res.send('Error code: 500');
    } else if (token) {
      //send them application
      res.sendFile(__dirname + '/client/dist/app.html');
    } else {
      //send them to google to be authorized
      google.getAuthURI((authURI) => {
        res.redirect(authURI);
      });
    }
  });
});

//recieve google's redirect
app.get('/googAutherized', (req, res) => {
  const { code } = req.query;
  //generate a token
  google.generateToken(code, (err, token) => {
    if (err) {
      console.log('Error generating a token:', err);
      res.status(500);
      res.send('Error code: 500');
    } else {
      //retrieve google's id for user
      google.getUserInfo(token, (err, { data }) => {
        if (err) {
          console.log('From /googAutherized');
          console.log('Error getting user info from Google:', err);
          res.status(500);
          res.send('Error code: 500');
        } else {
          //save user to DB
          pg.saveUser(data.id, token.access_token, req.sessionID, (err) => {
            if (err) {
              console.log('From /googAutherized');
              console.log('Error saving data to DB', err);
              res.status(500);
              res.send('Error code: 500');
            } else {
              res.redirect('/');
            }
          });
        }
      });
    }
  });
});

//provide data on app load
app.get('/contacts', (req, res) => {
  //does the user have contacts in the DB?
  pg.getComments(req.sessionID, (err, data) => {
    if (err) {
      res.status(500);
      res.send('Error code: 500');
      console.log('Error getting comments:', err);
    } else {
      //if we do not have ANY data in DB
      if (data.length === 0) {
        //get the data from the contacts
        google.getGoogleContacts(req.sessionID, (err, googleData) => {
          if (err) return console.log('problem getting data from google:', err);
          //save contact to the DB
          pg.saveContacts(req.sessionID, googleData, (err, result) => {
            //restart this process with saved contacts
            if (err) {
              console.log('Error saving contacts:', err);
              res.status(500);
              res.send('Error code: 500');
            } else {
              res.redirect('/contacts');
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
app.get('/syncContacts', (req, res) => {
  //call google sync contacts
  google.getSyncContacts(req.sessionID, (err, data) => {
    if (err) {
      console.log('Error syncing contacts with google:', err);
      res.status(500);
      res.send('Error code: 500');
    } else {
      //data will be a boolean
      res.send({ didSync: data });
    }
  });
});

//save comment in the DB to a contact
app.post('/contacts', (req, res) => {
  let data = req.body.data;
  pg.saveComment(res.sessionID, data, (err, result) => {
    if (err) {
      res.send('We made a mistake!');
      console.log('Mistake saving to contacts:', err);
    } else {
      res.send('Saved!');
    }
  });
});

app.listen(port, console.log('Listening on localhost:', port));
