const pg = require('./index.js');
const format = require('pg-format');

/* Notes:

  The pg-format package will take an array of arrays and format
  this query into a single string. Normally we dont want strings
  so we can prevent sql scripting attacks however, the query to save
  contacts will only ever be triggered by a request from google.

  We could also just make multiple queries.

*/

let helpers = {};

helpers.hasToken = (session, cb) => {
  let text = `SELECT access_token, sync_token 
              FROM users 
              WHERE session=($1)`;
  let values = [session];
  pg.query(text, values, (err, result) => {
    if (err) {
      cb(err);
    } else {
      if (result.rows[0] === undefined) {
        cb(null, false);
      } else {
        cb(null, result.rows[0]);
      }
    }
  });
};

helpers.saveUser = (googleuser, access_token, session, cb) => {
  let text = `INSERT INTO users (googleuser, access_token, session)
              VALUES ($1, $2, $3)`;
  let values = [googleuser, access_token, session];

  pg.query(text, values, (err, result) => {
    if (err) {
      //duplicate key, user exists, update session and redirect home
      if (err.code === '23505') {
        let text = `UPDATE users
                    SET session=$1 , access_token=$2
                    WHERE googleuser=$3;`;
        let values = [session, access_token, googleuser];
        pg.query(text, values, (err, result) => {
          if (err) {
            cb(err);
          } else {
            //finished saving, redirect
            cb(null);
          }
        });
      } else {
        //it is not a duplicate error
        cb(err);
      }
    } else {
      //finished saving, redirect
      cb(null);
    }
  });
};

const getUserGoogleId = (session, cb) => {
  let text = `SELECT googleuser
              FROM users
              WHERE session=$1;`;
  let values = [session];

  pg.query(text, values, (err, data) => {
    if (err) {
      cb(err);
    } else {
      cb(null, data.rows[0].googleuser);
    }
  });
};

const saveSyncToken = (token, googleuser, cb) => {
  let text = `UPDATE users
                      SET sync_token=$1
                      WHERE googleuser=$2`;
  let values = [token, googleuser];
  pg.query(text, values, (err, result) => {
    //fin
    cb(err, result);
  });
};

const formatContactData = (googleuser, googleData) => {
  // console.log('syncRequest data:', googleData.data.connections);
  return googleData.connections.map((contact) => {
    //check to see if we recieve the information
    let displayName = contact.names ? contact.names[0].displayName : null;
    let phoneNumber = contact.phoneNumbers
      ? contact.phoneNumbers[0].value
      : null;
    let email = contact.emailAddresses ? contact.emailAddresses[0].value : null;

    return [googleuser, displayName, phoneNumber, email];
  });
};

helpers.saveContacts = (session, googleData, cb) => {
  //grab user id from db
  getUserGoogleId(session, (err, googleuser) => {
    if (err) {
      cb(err);
    } else {
      let token = googleData.nextSyncToken;
      saveSyncToken(token, googleuser, (err, result) => {
        if (err) {
          cb(err);
        } else if (googleData.connections !== undefined) {
          let values = formatContactData(googleuser, googleData);
          let queryString = format(
            `INSERT INTO comments (users_googleuser, name, phone_number, email)
             VALUES %L`,
            values
          );
          pg.query(queryString, (err, result) => {
            if (err) {
              cb(err);
            } else {
              //pass true to declare new contacts
              cb(null, true);
            }
          });
        } else {
          //pass false to declare no new contacts
          cb(null, false);
        }
      });
    }
  });
};

helpers.getComments = (session, cb) => {
  //grab users google id
  getUserGoogleId(session, (err, googleuser) => {
    if (err) {
      cb(err);
    } else {
      //retrieve comments made by user_googleuser
      let text = `SELECT id, name, phone_number, email, comment
                  FROM comments
                  WHERE users_googleuser=$1
                  ORDER BY name ASC;`;
      let values = [googleuser];
      pg.query(text, values, (err, comments) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, comments.rows);
        }
      });
    }
  });
};

helpers.saveComment = (session, data, cb) => {
  let text = `UPDATE comments
              SET comment=$1
              WHERE id=$2;`;
  let values = [data.comment, data.id];
  pg.query(text, values, (err, result) => {
    cb(err, result);
  });
};

module.exports = helpers;
