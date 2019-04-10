const client = require('./index.js');

let helpers = {};

helpers.getAuth = (session, cb) => {
  // let queryString = `SELECT code
  //                    FROM users
  //                    WHERE session='${session}';`;
  console.log('session passed to PG:', session);
  let queryString = `SELECT code 
                     FROM users
                     WHERE session='${session}';`;
  client.query(queryString, (err, result) => {
    if (err) return console.log('getAuth error!', err);
    console.log('Auth Code from db:', result);
    cb(err, result.rows[0]);
  });
};

helpers.saveAuth = (code, sessionID, cb) => {
  let queryString = `INSERT INTO users (code, session)
                     VALUES ('${code}', '${sessionID}')`;

  console.log('saving Auth:', code, sessionID);

  client.query(queryString, (err, result) => {
    if (err) return console.log(err);
    cb();
  });
};

module.exports = helpers;
