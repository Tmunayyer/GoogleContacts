const client = require('./index.js');

let helpers = {};

helpers.getAuth = (session, cb) => {
  let queryString = `SELECT code 
                     FROM users
                     WHERE session='${session}';`;
  client.query(queryString, (err, result) => {
    if (err) return console.log('getAuth error!', err);
    cb(err, result.rows[0]);
  });
};

helpers.saveAuth = (code, sessionID, cb) => {
  let queryString = `INSERT INTO users (code, session)
                     VALUES ('${code}', '${sessionID}')`;
  client.query(queryString, (err, result) => {
    if (err) return console.log(err);
    cb();
  });
};

module.exports = helpers;
