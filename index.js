const express = require('express');
const bodyParser = require('body-parser');

const getSession = require('./server/session.js');

const app = express();
const port = 4000;

app.use(express.static('client/dist'));
app.use(bodyParser.json());
app.use(getSession());

app.get('/', (req, res) => {
  res.send('contact');
});

app.listen(port, console.log('Listening on localhost:', port));
