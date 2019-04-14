const { Client } = require('pg');

const NODE_ENV = process.env.NODE_ENV;
const HOST_IP = process.env.HOST_IP;
const DB_PASS = process.env.DB_PASS;

const host = NODE_ENV === 'PROD' ? HOST_IP : 'localhost';

const connectObj = {
  host: host,
  user: 'postgres',
  database: 'comtacts',
  port: 5432
};

if (NODE_ENV === 'PROD') {
  connectObj.password = DB_PASS;
}

const client = new Client(connectObj);

client.connect((err, result) => {
  if (err) {
    console.log('Error connecting to the DB:', err);
  } else {
    console.log('Connection to DB successful.');
  }
});

exports.connectObj = connectObj;
exports.client = client;
