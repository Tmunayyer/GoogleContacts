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

const peopleReqParams = {
  resourceName: 'people/me',
  //TODO: this is the max page size
  // if its possible someone has more (possibly a corporate account)
  // maybe introduce a pagination in the app?
  pageSize: '2000',
  //provide a sync token for late, need to store this in DB
  requestSyncToken: true,
  personFields: 'names,phoneNumbers,emailAddresses'
};

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
      people.people.connections.list(peopleReqParams, (err, data) => {
        if (err) {
          cb(err);
        } else {
          const myData = data.data;
          cb(null, myData);
        }
      });
    }
  });
};

helpers.getSyncContacts = (session, cb) => {
  //grab necessary toekn fromm db
  pg.hasToken(session, (err, tokens) => {
    let access_token = { access_token: tokens.access_token };
    let sync_token = tokens.sync_token;

    let oAuth2Client = makeOAuth2Client();
    oAuth2Client.setCredentials(access_token);
    const people = google.people({
      version: 'v1',
      auth: oAuth2Client
    });
    //append property syncToken
    peopleReqParams.syncToken = sync_token;
    //google request
    people.people.connections.list(peopleReqParams, (err, data) => {
      //remove property syncToken
      delete peopleReqParams.syncToken;

      if (err) {
        cb(err);
      } else {
        const myData = data.data;
        pg.saveContacts(session, myData, cb);
      }
    });
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
