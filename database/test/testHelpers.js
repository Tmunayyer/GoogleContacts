let helpers = {};

helpers.mockGData = {
  connections: [
    {
      names: [{ displayName: 'Mymock Data' }],
      emailAddresses: [{ value: 'mymock@gmail.com' }]
    },
    {
      names: [{ displayName: 'Mydata Mock' }],
      emailAddresses: [{ value: 'mydata@mock.com' }],
      phoneNumbers: [{ value: '(123) 456-7891' }]
    }
  ],
  nextSyncToken:
    '^MisA7pC7HgAAABIInbnTz8XN4QIQnbnTz8XN4QKV2Z-h-yhpkRx-kWiqO3jUOiQ5ZDY0M2FmYi01MGRmLTQ1MGMtYTZkMi1mZjgwYjlmODYwODI',
  totalPeople: 4,
  totalItems: 4
};

helpers.mockCliData = {
  id: 9999,
  comment: 'Here is a test comment!'
};

module.exports = helpers;
