const { when } = require('feathers-hooks-common');
const authorize = require('./hooks/abilities');
const authenticate = require('./hooks/authenticate');
const logger = require('./hooks/log')
const showErrors = require('./hooks/show-errors');
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
    all: [
      when(
        hook => hook.params.provider && `/${hook.path}` !== hook.app.get('authentication').path,
        authenticate,
        authorize()
      ),
      logger()
    ],
    find: [
      deleted
    ],
    get: [
      deleted
    ],
    create: [
      context => {
        delete context.data.deletedAt;
      }
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
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      showErrors()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
