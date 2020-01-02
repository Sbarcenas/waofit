const currentUserBF = require('./hooks/current-user-b-f')

const { softDelete2, disallow } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [
      currentUserBF()
    ],
    get: [
      disallow('external')
    ],
    create: [
      disallow('external')
    ],
    update: [
      disallow('external')
    ],
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
