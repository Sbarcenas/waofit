const usersAddressesBC = require('./hooks/users-addresses-b-c');
const usersAddressesAC = require('./hooks/users-addreeses-a-c');
const usersAddressesAP = require('./hooks/users-addresses-a-p');
const validationOfFields = require('../../hooks/validations-of-fields');
const { softDelete } = require('feathers-hooks-common')

const deleted = softDelete({
  // context is the normal hook context
  deletedQuery: async context => {
    return { deletedAt: null };
  },
  removeData: async context => {
    return { deletedAt: new Date().toISOString() };
  }
});

module.exports = {
  before: {
    all: [],
    find: [
      deleted
    ],
    get: [
      deleted
    ],
    create: [
      validationOfFields(),
      usersAddressesBC()
    ],
    update: [
      deleted
    ],
    patch: [
      deleted
    ],
    remove: [
      deleted
    ]
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
