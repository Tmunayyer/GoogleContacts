const { google } = require('googleapis');
const fs = require('fs');

const pg = require('../database/query.js');

/* NOTES

  oAuth was completely new to me.
  Main source: https://developers.google.com/people/quickstart/nodejs

    Most of what I got from google's quickstart has been tweaked heavily
    to fit my needs.

*/

// Using readFileSync to ensure this is finished before server starts.
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
    if (err) return console.log('Error generating token:', err);
    cb(token);
  });
};

helpers.authorize = (res) => {
  let oAuth2Client = makeOAuth2Client();
  const authURI = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  res.redirect(authURI);
};

helpers.getData = (session, cb) => {
  let oAuth2Client = makeOAuth2Client();

  pg.hasToken(session, (token) => {
    oAuth2Client.setCredentials(token);
    const people = google.people({
      version: 'v1',
      auth: oAuth2Client
    });
    const params = {
      resourceName: 'people/me',
      pageSize: '100',
      personFields: 'names,phoneNumbers,emailAddresses'
    };
    people.people.connections.list(params, (err, data) => {
      if (err) return cb(err, null);
      const myData = data.data.connections;
      cb(null, myData);
    });
  });
};

helpers.getUserInfo = (token, cb) => {
  let oAuth2Client = makeOAuth2Client();
  oAuth2Client.setCredentials(token);
  let something = google.oauth2({
    auth: oAuth2Client,
    version: 'v2'
  });
  something.userinfo.v2.me.get((err, res) => {
    if (err) return console.log(err);
    cb(res);
  });
};

module.exports = helpers;
