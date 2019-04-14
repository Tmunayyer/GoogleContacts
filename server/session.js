const session = require('express-session');
const uuid = require('uuid/v4');
const pgSession = require('connect-pg-simple')(session);

const NODE_ENV = process.env.NODE_ENV;
const SECRET = process.env.SECRET;

//tell pgSession where to connect
const pgConObj = require('../database/index.js').connectObj;

//middlewear that will provide session/cookies
const getSession = (req, res, next) => {
  return session({
    genid: (req) => {
      //get unique ID
      return uuid();
    },
    //use pg as session store
    store: new pgSession({ conObject: pgConObj }),
    //sign the cookie with this secret
    secret: NODE_ENV === 'PROD' ? SECRET : 'BladeRunner',
    //resave = true means we will save cookie if cookie comes back unaltered
    // this is a problem if a client makes parallel requests
    // possibly causing one session to overwright the other.
    resave: false,
    //Save a session when it is new but not modified
    // needs more research but shouldnt matter now.
    // true is default
    saveUninitialized: true,
    //set expiration of cookie
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } //30 days
  });
};

module.exports = getSession;
