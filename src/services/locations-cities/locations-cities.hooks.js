const { isProvider, iff } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
    find: [
      iff(isProvider('external'),
        () => console.log('----------external')
      ).else(
        () => console.log('------server')
      ),
    ],
    get: [],
    create: [],
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
