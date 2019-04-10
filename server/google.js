const { google } = require('googleapis');
const fs = require('fs');

const db = require('../database/query.js');

/* NOTES

  This was new to me.
  Source: https://developers.google.com/people/quickstart/nodejs

    I used this page to heavily influence how I handles this. Some functions
    are complete rips, others are tweaked heavily to my needs.

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

//function to get new token upon failure
// const getNewAuthorizationCode = (oAuth2Client, res) => {
//   const authURI = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   });
//   res.redirect(authURI);
// };

helpers.authorize = (res) => {
  let oAuth2Client = makeOAuth2Client();
  const authURI = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  res.redirect(authURI);
};

helpers.getAuthURI = () => {
  let oAuth2Client = makeOAuth2Client();
  const authURI = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  return authURI;
};

// helpers.authorize = (res, cb) => {
//   let oAuth2Client = makeOAuth2Client();

//   //db.query with for the cookie.
//   // if we get the result,
//   // respond true and provide data
//   // if we get null
//   // getNewAuthorizationCode!
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getNewAuthorizationCode(oAuth2Client, res);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     cb(oAuth2Client);
//   });
// };

helpers.getData = (auth, cb) => {
  const service = google.people({ version: 'v1', auth });
  const params = {
    resourceName: 'people/me',
    pageSize: '10',
    personFields: 'names,emailAddresses'
  };

  //this is the google API request
  service.people.connections.list(params, (err, data) => {
    const myData = data.data.connections;
    cb(err, myData);
  });
};

helpers.generateAccessToken = (code, req, cb) => {
  let oAuth2Client = makeOAuth2Client();
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.log('Error retrieving token:', err);
    oAuth2Client.setCredentials(token);
    cb();
  });
};

module.exports = helpers;
