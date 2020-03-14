const procressConfirmation = require("./hooks/process-confirmation");
const { disallow } = require("feathers-hooks-common");
module.exports = {
  before: {
    all: [],
    find: [disallow("external")],
    get: [disallow("external")],
    create: [procressConfirmation()],
    update: [disallow("external")],
    patch: [disallow("external")],
    remove: [disallow("external")]
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
