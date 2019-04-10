const client = require('./index.js');

let helpers = {};

helpers.hasToken = (session, cb) => {
  let queryString = `SELECT access_token 
                     FROM users
                     WHERE session='${session}';`;
  client.query(queryString, (err, result) => {
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
  client.query(queryString, (err, result) => {
    if (err) {
      //duplicate key, user exists, update session and redirect home
      if (err.code === '23505') {
        queryString = `UPDATE users
                       SET session = '${session}'
                       WHERE googleuser = '${googleuser}';`;
        client.query(queryString, (err, result) => {
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

module.exports = helpers;
