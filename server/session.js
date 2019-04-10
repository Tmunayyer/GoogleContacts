const session = require('express-session');
const uuid = require('uuid/v4');
const pgSession = require('connect-pg-simple')(session);

const env = process.env.ENVIRONMENT;

const pgConObj = {
  host: 'localhost',
  database: 'comtacts',
  port: 5432
};

const getSession = (req, res, next) => {
  return session({
    genid: (req) => {
      return uuid();
    },
    store: new pgSession({ conObject: pgConObj }),
    secret: env === 'production' ? process.env.SSECRET : 'BladeRunner',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } //30 days
  });
};

module.exports = getSession;
