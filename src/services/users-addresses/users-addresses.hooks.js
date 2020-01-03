const usersAddressesBC = require('./hooks/users-addresses-b-c');
const usersAddressesAC = require('./hooks/users-addreeses-a-c');
const usersAddressesAP = require('./hooks/users-addresses-a-p');

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
    create: [
      usersAddressesAC()
    ],
    update: [],
    patch: [
      usersAddressesAP()
    ],
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
