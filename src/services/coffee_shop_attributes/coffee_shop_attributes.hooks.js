const removeSoftDelete = require("../../hooks/remove-softdelete");
const searchAdmin = require("./hooks/search-admin");
const { disallow } = require("feathers-hooks-common");
const restrictDelete = require("./hooks/restrict-delete");

module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [],
    update: [disallow("external")],
    patch: [],
    remove: [restrictDelete(), removeSoftDelete()],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
