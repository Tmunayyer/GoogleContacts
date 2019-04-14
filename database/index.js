const { Client } = require('pg');

const connectObj = {
  host: 'localhost',
  database: 'comtacts',
  port: 5432
};

const client = new Client(connectObj);

client.connect();

exports.connectObj = connectObj;
exports.client = client;
