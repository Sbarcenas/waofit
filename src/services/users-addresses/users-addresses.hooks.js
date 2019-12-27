const usersAddressesBC = require('./hooks/users-addresses-b-c');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      usersAddressesBC()
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
