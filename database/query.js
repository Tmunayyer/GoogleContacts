const pg = require('./index.js');
const format = require('pg-format');

let helpers = {};

/* Notes

  While working on this I came across a thread discussing
  SQL scripting attacks. For this reason we should not use
  template literals to query the DB. Instead we pass in the
  values as arguments. This way the query is already set in place
  and PG will just insert each value.

*/

helpers.hasToken = (session, cb) => {
  let text = `SELECT access_token 
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

helpers.saveContacts = (session, googleData, cb) => {
  getUserGoogleId(session, (err, googleuser) => {
    if (err) {
      cb(err);
    } else {
      let values = googleData.connections.map((contact) => {
        //check to see if we recieve the information
        let displayName = contact.names ? contact.names[0].displayName : null;
        let phoneNumber = contact.phoneNumbers
          ? contact.phoneNumbers[0].value
          : null;
        let email = contact.emailAddresses
          ? contact.emailAddresses[0].value
          : null;

        return [googleuser, displayName, phoneNumber, email];
      });

      // TODO: need to figure this one out, maybe its ok? the only
      // ones to hit this point is google...
      let queryString = format(
        `INSERT INTO comments (users_googleuser, name, phone_number, email)
         VALUES %L`,
        values
      );
      pg.query(queryString, (err, result) => {
        if (err) {
          cb(err);
        } else {
          let text = `UPDATE users
                      SET sync_token=$1
                      WHERE googleuser=$2`;
          let values = [googleData.nextSyncToken, googleuser];
          pg.query(text, values, (err, result) => {
            cb(err, result);
          });
        }
      });
    }
  });
};

helpers.getComments = (session, cb) => {
  getUserGoogleId(session, (err, googleuser) => {
    if (err) {
      cb(err);
    } else {
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
