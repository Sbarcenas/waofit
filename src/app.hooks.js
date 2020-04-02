const { when, iff, isProvider } = require("feathers-hooks-common");
const authorize = require("./hooks/abilities");
const authenticate = require("./hooks/authenticate");
const logger = require("./hooks/log");
const showErrors = require("./hooks/show-errors");
const { softDelete } = require("feathers-hooks-common");
const removeSoftdelete = require("./hooks/remove-softdelete");

const deleted = softDelete({
  // context is the normal hook context
  deletedQuery: async context => {
    if (context.path == "current-user") return context;
    if (context.path == "recovery-password") return context;
    const field = `${context.service.getModel().tableName}.deletedAt`;
    return { [field]: null };
  },
  removeData: async context => {
    return { deletedAt: new Date().toISOString() };
  }
});

module.exports = {
  before: {
    all: [
      when(
        hook =>
          hook.params.provider &&
          `/${hook.path}` !== hook.app.get("authentication").path,
        authenticate,
        authorize()
      ),
      logger()
    ],
    find: [deleted],
    get: [deleted],
    create: [
      context => {
        delete context.data.deletedAt;
      }
    ],
    update: [deleted],
    patch: [deleted],
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
    all: [showErrors()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
