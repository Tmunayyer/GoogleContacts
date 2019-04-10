const express = require('express');

const app = express();
const port = 4000;

app.use(express.static());

app.get('/', (req, res) => {
  res.send('contact');
});

app.listen(port, console.log('Listening on localhost:', port));
