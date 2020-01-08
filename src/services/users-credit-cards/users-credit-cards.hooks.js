const usersCreditCardsBC = require('./hooks/users-credit-cards-b-c');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      usersCreditCardsBC()
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
