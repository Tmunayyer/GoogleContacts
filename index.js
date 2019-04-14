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

const handleInternalServerError = (res) => {
  res.status(500);
  res.send('Error code: 500');
};

//homepage
app.get('/', (req, res) => {
  //if we have this user in the db
  pg.hasToken(req.sessionID, (err, token) => {
    if (err) {
      console.log('Error retrieving token from DB:', err);
      return handleInternalServerError(res);
    }

    if (token) {
      //send them application
      res.sendFile(__dirname + '/client/dist/app.html');
      return;
    }

    //send them to google to be authorized
    google.getAuthURI((authURI) => {
      res.redirect(authURI);
    });
  });
});

//recieve google's redirect
app.get('/googAutherized', (req, res) => {
  const { code } = req.query;

  //generate a token
  google.generateToken(code, (err, token) => {
    if (err) {
      console.log('Error generating a token:', err);
      return handleInternalServerError(res);
    }

    //retrieve google's id for user
    google.getUserInfo(token, (err, { data }) => {
      if (err) {
        console.log('From /googAutherized');
        console.log('Error getting user info from Google:', err);
        return handleInternalServerError(res);
      }

      //save user to DB
      pg.saveUser(data.id, token.access_token, req.sessionID, (err) => {
        if (err) {
          console.log('From /googAutherized');
          console.log('Error saving data to DB', err);
          return handleInternalServerError(res);
        }

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
      console.log('Error getting comments:', err);
      return handleInternalServerError(res);
    }

    if (data.length === 0) {
      //get the data from the contacts
      google.getGoogleContacts(req.sessionID, (err, googleData) => {
        if (err) {
          console.log('Problem getting data from google:', err);
          return handleInternalServerError(res);
        }

        //save contact to the DB
        pg.saveContacts(req.sessionID, googleData, (err, result) => {
          if (err) {
            console.log('Error saving contacts:', err);
            return handleInternalServerError(res);
          }

          //restart this process with saved contacts
          res.redirect('/contacts');
        });
      });
    } else {
      //send down saved contacts
      res.send(data);
    }
  });
});

//responds to a button on the page to refresh contacts list
app.get('/syncContacts', (req, res) => {
  //call google sync contacts
  google.getSyncContacts(req.sessionID, (err, data) => {
    if (err) {
      console.log('Error syncing contacts with google:', err);
      return handleInternalServerError(res);
    }

    //data will be a boolean
    res.send({ didSync: data });
  });
});

//save comment in the DB to a contact
app.post('/contacts', (req, res) => {
  let data = req.body.data;
  pg.saveComment(res.sessionID, data, (err, result) => {
    if (err) {
      console.log('Mistake saving to contacts:', err);
      return handleInternalServerError(res);
    }

    res.send('Saved!');
  });
});

app.listen(port, console.log('Listening on localhost:', port));
