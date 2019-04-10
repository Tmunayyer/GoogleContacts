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

helpers.saveUser = (access_token, session, cb) => {
  let queryString = `INSERT INTO users (access_token, session)
                     VALUES ('${access_token}', '${session}')`;
  client.query(queryString, (err, result) => {
    if (err) return console.log('Error saving user:', err);
    cb();
  });
};

module.exports = helpers;
