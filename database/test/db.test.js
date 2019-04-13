const pg = require('../index.js');
const dbHelpers = require('../query.js');

const testUtil = require('./testHelpers.js');

//global to keep access across all tests
const fakeUserCredentials = {
  googleuser: '11589579824',
  access_token:
    'ya29.GlvpBuU38YwE9p6vaenQlldZHCHVwQUuy6QlhdwAh8AiKx6UQFf_VMhKICgx',
  sync_token: '^MisA7pC7HgAAABIIpNmprLjL4QIQvK-tjrjL4QJU0z5tqX-OpjJxE6nyK83-Oi',
  session: 'b60168c4-7649-454c-b1'
};

const createFakeUser = (cb) => {
  const { googleuser, access_token, sync_token, session } = fakeUserCredentials;
  let text = `INSERT INTO users (googleuser, access_token, sync_token, session)
              VALUES ($1, $2, $3, $4)`;
  let values = [googleuser, access_token, sync_token, session];
  pg.query(text, values, (err, result) => {
    cb(err, result);
  });
};

const deleteFakeUser = (cb) => {
  const { googleuser, access_token, sync_token, session } = fakeUserCredentials;
  let text = `DELETE FROM users
              WHERE googleuser=$1;`;
  let values = [googleuser];
  pg.query(text, values, (err, result) => {
    cb(err, result);
  });
};

describe('Testing user retrieval', () => {
  beforeEach((done) => {
    createFakeUser((err, result) => {
      if (err) {
        console.log('Error creating fake user:', err);
      }

      done();
    });
  });
  afterEach((done) => {
    deleteFakeUser((err, result) => {
      if (err) {
        console.log('Error deleting fake user:', err);
      }
      done();
    });
  });

  const { googleuser, access_token, sync_token, session } = fakeUserCredentials;
  test('hasToken should return tokens (access & sync):', (done) => {
    //has token takes a session and callback
    dbHelpers.hasToken(session, (err, result) => {
      if (err) {
        console.log('Error with hasToken:', err);
      } else {
        expect(result.access_token).toBe(access_token);
        expect(result.sync_token).toBe(sync_token);
      }
      done();
    });
  });
});

describe('Testing user creation', () => {
  afterAll((done) => {
    deleteFakeUser((err, result) => {
      if (err) {
        console.log('Error deleting fake user:', err);
      }
      done();
    });
  });

  let { googleuser, access_token, sync_token, session } = fakeUserCredentials;

  test('saveUser should save a new user:', (done) => {
    dbHelpers.saveUser(googleuser, access_token, session, (err, result) => {
      if (err) {
        console.log('Error with saveUser:', err);
      } else {
        //user helpes to check if user is in DB
        dbHelpers.hasToken(session, (err, result) => {
          if (err) {
            console.log('Error with hasToken:', err);
          } else {
            //same tests as hasToken with different method of inject
            // data into pg
            expect(result.access_token).toBe(access_token);
          }
          done();
        });
      }
    });
  });

  test('saveUser should overwright access token with duplicate google IDs:', (done) => {
    const same_googleuser = googleuser;
    const new_token = 'ya29.GlvpBfhHIH8590hiyfkjh65fKVAh8AiKx6UQFf_VMhKICgx';
    const new_session = 'b60124df4-7649-12fadc-b1';

    let query = `SELECT * FROM users WHERE googleuser='${same_googleuser}'`;

    //look at current user
    pg.query(query, (err, result) => {
      if (err) {
        console.log('Error with inital query:', err);
      } else {
        expect(result.rows[0].access_token).not.toBe(new_token);
        expect(result.rows[0].session).not.toBe(new_session);
      }
      //save user with new information
      dbHelpers.saveUser(googleuser, new_token, new_session, (err, result) => {
        if (err) {
          console.log('Error with saveUser:', err);
        } else {
          //check the new data
          pg.query(query, (err, result) => {
            if (err) {
              console.log('Error with post saveUser query:', err);
            } else {
              expect(result.rows[0].access_token).toBe(new_token);
              expect(result.rows[0].session).toBe(new_session);
            }
            done();
          });
        }
      });
    });
  });
});

describe('Test saving Google data', () => {
  let { googleuser, access_token, sync_token, session } = fakeUserCredentials;
  beforeEach((done) => {
    createFakeUser((err, result) => {
      if (err) {
        console.log('Error creating fake user:', err);
      }
      done();
    });
  });
  afterEach((done) => {
    //delete comments then user to avoid FK contraints err
    let queryString = `DELETE FROM comments
                       WHERE users_googleuser='${googleuser}';`;
    pg.query(queryString, (err, result) => {
      if (err) {
        console.log('Error deleting comments:', err);
      } else {
        deleteFakeUser((err, result) => {
          if (err) {
            console.log('Error deleting fake user', err);
          }
          done();
        });
      }
    });
  });

  test('Contacts should end up in the database', (done) => {
    //takes session and google data
    //TODO make mock data for google
    dbHelpers.saveContacts(session, testUtil.mockGData, (err, boolean) => {
      if (err) {
        console.log('Error saving contacts:', err);
      } else {
        //check database for contacts
        let queryString = `SELECT * FROM comments WHERE users_googleuser='${googleuser}';`;
        pg.query(queryString, (err, result) => {
          if (err) {
            console.log('Error with query for contacts', err);
          } else {
            let expectOne =
              testUtil.mockGData.connections[0].names[0].displayName;
            let expectTwo =
              testUtil.mockGData.connections[1].names[0].displayName;

            expect(result.rows[0].name).toBe(expectOne);
            expect(result.rows[1].name).toBe(expectTwo);
          }
          done();
        });
      }
    });
  });
});

describe('Test saving and retrieving comments', () => {
  let { googleuser, access_token, sync_token, session } = fakeUserCredentials;

  beforeAll((done) => {
    createFakeUser((err, result) => {
      if (err) {
        console.log('Error creating fake user:', err);
      }
      dbHelpers.saveContacts(session, testUtil.mockGData, (err, boolean) => {
        if (err) {
          console.log('Error saving contact:', err);
        }
        done();
      });
    });
  });

  afterAll((done) => {
    //delete comments then user to avoid FK contraints err
    let queryString = `DELETE FROM comments
                       WHERE users_googleuser='${googleuser}';`;
    pg.query(queryString, (err, result) => {
      if (err) {
        console.log('Error deleting comments:', err);
      } else {
        deleteFakeUser((err, result) => {
          if (err) {
            console.log('Error deleting fake user', err);
          }
          done();
        });
      }
    });
  });

  /*

    The client gets the contact's id number in PG when its initially retrieved.
    After which, when we save a comment we do it based on ID. This is to allow
    if multiple users have the same contact.

    Because of this I need to get the contacts ID's first to pass into saveComment.

  */
  test('Comments should be saved to a contact:', (done) => {
    let queryString = `SELECT id FROM comments WHERE users_googleuser='${googleuser}';`;
    pg.query(queryString, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        //set the id
        testUtil.mockCliData.id = result.rows[0].id;

        dbHelpers.saveComment(session, testUtil.mockCliData, (err, res) => {
          if (err) {
            console.log('Error saving comments:', err);
          }
          let id = testUtil.mockCliData.id;
          let queryString = `SELECT * FROM comments WHERE id='${id}'`;
          pg.query(queryString, (err, result) => {
            if (err) {
              console.log('Error getting comments from DB', err);
            } else {
              expect(result.rows[0].comment).toBe(testUtil.mockCliData.comment);
            }
            done();
          });
        });
      }
    });
  });

  test('Shoudl be able to retrieve comments:', (done) => {
    dbHelpers.getComments(session, (err, result) => {
      if (err) {
        console.log('Error getting comments from db:', err);
      } else {
        expect(result[1].comment).toBe(testUtil.mockCliData.comment);
      }
      done();
    });
  });
});
