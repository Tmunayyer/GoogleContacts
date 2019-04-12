const { google } = require('googleapis');
const fs = require('fs');

const pg = require('../database/query.js');

/* NOTES

  oAuth was completely new to me.
  Main source: https://developers.google.com/people/quickstart/nodejs

    Most of what I got from google's quickstart has been tweaked heavily
    to fit my needs.


  When we retrieve the access tokens it would be a good idea to handle
  the refresh tokens. The google docs explain this but is not important
  for this project.
  
*/

// Using readFileSync to ensure this is finished before server starts.
// In production Ill need a real secrete management system.
let CREDENTIALS = JSON.parse(fs.readFileSync('./server/credentials.json'));
let SCOPES = [
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/userinfo.email'
];

// To be made module.exports
let helpers = {};

const makeOAuth2Client = () => {
  return new google.auth.OAuth2(
    CREDENTIALS.web.client_id,
    CREDENTIALS.web.client_secret,
    CREDENTIALS.web.redirect_uris[0]
  );
};

helpers.generateToken = (code, cb) => {
  let oAuth2Client = makeOAuth2Client();
  oAuth2Client.getToken(code, (err, token) => {
    cb(err, token);
  });
};

helpers.getAuthURI = (cb) => {
  let oAuth2Client = makeOAuth2Client();
  const authURI = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  cb(authURI);
};

helpers.getGoogleContacts = (session, cb) => {
  let oAuth2Client = makeOAuth2Client();

  pg.hasToken(session, (err, token) => {
    if (err) {
      console.log('Error getting token inside getGoogleContacts', err);
      cb(err);
    } else {
      oAuth2Client.setCredentials(token);
      const people = google.people({
        version: 'v1',
        auth: oAuth2Client
      });
      const params = {
        resourceName: 'people/me',
        //TODO: implement pagination, only ever getting 100 contacts
        pageSize: '100',
        personFields: 'names,phoneNumbers,emailAddresses'
      };
      people.people.connections.list(params, (err, data) => {
        if (err) {
          cb(err);
        } else {
          const myData = data.data.connections;
          cb(null, myData);
        }
      });
    }
  });
};

helpers.getUserInfo = (token, cb) => {
  let oAuth2Client = makeOAuth2Client();
  oAuth2Client.setCredentials(token);
  let withAuth = google.oauth2({
    auth: oAuth2Client,
    version: 'v2'
  });
  withAuth.userinfo.v2.me.get((err, data) => {
    if (err) {
      cb(err, data);
    } else {
      cb(null, data);
    }
  });
};

module.exports = helpers;
