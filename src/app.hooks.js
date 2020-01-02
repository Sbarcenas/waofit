const { when } = require('feathers-hooks-common');
const authorize = require('./hooks/abilities');
const authenticate = require('./hooks/authenticate');
const logger = require('./hooks/log')
const showErrors = require('./hooks/show-errors');
module.exports = {
  before: {
    all: [
      when(
        hook => hook.params.provider && `/${hook.path}` !== hook.app.get('authentication').path,
        authenticate,
        authorize()
      ),
      // logger()
    ],
    find: [],
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
