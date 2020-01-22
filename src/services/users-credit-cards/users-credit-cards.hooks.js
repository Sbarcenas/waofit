const usersCreditCardsBC = require('./hooks/users-credit-cards-b-c');
const { disallow } = require('feathers-hooks-common')
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      usersCreditCardsBC()
    ],
    update: [],
    patch: [
      disallow('external')
    ],
    remove: [
      disallow('external')
    ]
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
