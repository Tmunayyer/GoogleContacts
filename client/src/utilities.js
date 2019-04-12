import axios from 'axios';

let helpers = {};

helpers.getData = (cb) => {
  axios
    .get('/contacts')
    .catch((err) => {
      cb(err);
    })
    .then(({ data }) => {
      cb(null, data);
    });
};

helpers.saveComment = (data, cb) => {
  axios
    .post('/contacts', {
      data: data
    })
    .catch((err) => {
      cb(err);
      console.log(err);
    })
    .then((res) => {
      cb(null, res);
      //good save, lets update state locally
    });
};

helpers.syncContacts = (cb) => {
  axios
    .get('/syncContacts')
    .catch((err) => {
      cb(err);
    })
    .then((data) => {
      cb(null, data);
    });
};

export default helpers;
