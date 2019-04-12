const session = require('express-session');
const uuid = require('uuid/v4');
const pgSession = require('connect-pg-simple')(session);

const env = process.env.ENVIRONMENT;

//tell pgSession where to connect
const pgConObj = {
  host: 'localhost',
  //comtacts is name of app, not a typo
  database: 'comtacts',
  port: 5432
};

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
    secret: env === 'production' ? process.env.SECRET : 'BladeRunner',
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
