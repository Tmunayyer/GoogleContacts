const pg = require('./index.js');
const format = require('pg-format');

let helpers = {};

helpers.hasToken = (session, cb) => {
  let queryString = `SELECT access_token 
                     FROM users
                     WHERE session='${session}';`;
  pg.query(queryString, (err, result) => {
    if (err) return console.log('getAuth error!', err);
    if (result.rows[0] === undefined) {
      cb(false);
    } else {
      cb(result.rows[0]);
    }
  });
};

helpers.saveUser = (googleuser, access_token, session, cb) => {
  let queryString = `INSERT INTO users (googleuser, access_token, session)
                     VALUES ('${googleuser}', '${access_token}', '${session}')`;
  pg.query(queryString, (err, result) => {
    if (err) {
      //duplicate key, user exists, update session and redirect home
      if (err.code === '23505') {
        queryString = `UPDATE users
                       SET session = '${session}', access_token = '${access_token}'
                       WHERE googleuser = '${googleuser}';`;
        pg.query(queryString, (err, result) => {
          if (err) return console.log('Error updating user:', err);
          //finished saving, redirect
          cb();
        });
      } else {
        return console.log('Error saving user:', err);
      }
    }
    //finished saving, redirect
    cb();
  });
};

const getUserGoogleId = (session, cb) => {
  let queryString = `SELECT googleuser
                     FROM users
                     WHERE session='${session}';`;

  pg.query(queryString, (err, data) => {
    if (err) return console.log('error getting google id', err);
    cb(data.rows[0].googleuser);
  });
};

helpers.saveContacts = (session, googleData, cb) => {
  getUserGoogleId(session, (googleuser) => {
    let values = googleData.map((contact) => {
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

    let queryString = format(
      `INSERT INTO comments (users_googleuser, name, phone_number, email)
       VALUES %L`,
      values
    );
    pg.query(queryString, (err, result) => {
      cb(err, result);
    });
  });
};

helpers.getComments = (session, cb) => {
  getUserGoogleId(session, (googleuser) => {
    let queryString = `SELECT id, name, phone_number, email, comment
                       FROM comments
                       WHERE users_googleuser='${googleuser}'
                       ORDER BY name ASC;`; //grab comments with id = data
    pg.query(queryString, (err, comments) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, comments.rows);
      }
    });
  });
};

helpers.saveComment = (session, data, cb) => {
  let queryString = `UPDATE comments
                     SET comment='${data.comment}'
                     WHERE id='${data.id}';`;
  pg.query(queryString, (err, result) => {
    cb(err, result);
  });
};

module.exports = helpers;
