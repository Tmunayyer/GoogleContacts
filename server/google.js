const { google } = require('googleapis');
const fs = require('fs');

const db = require('../database/query.js');

/* NOTES

  oAuth was completely new to me.
  Main source: https://developers.google.com/people/quickstart/nodejs

    Most of what I got from their quickstart has been tweaked heavily
    to fit my needs.

*/

// Using readFileSync to ensure this is finished before server starts.
let CREDENTIALS = JSON.parse(fs.readFileSync('./server/credentials.json'));
let SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];

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
  console.log('code passed into generateToken:', code);
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

  db.hasToken(session, (token) => {
    oAuth2Client.setCredentials(token);
    const service = google.people({ version: 'v1', auth: oAuth2Client });
    const params = {
      resourceName: 'people/me',
      pageSize: '10',
      personFields: 'names,emailAddresses'
    };
    service.people.connections.list(params, (err, data) => {
      if (err) return console.log('Error contacting google:', err);
      const myData = data.data.connections;
      cb(myData);
    });
  });
};

module.exports = helpers;
