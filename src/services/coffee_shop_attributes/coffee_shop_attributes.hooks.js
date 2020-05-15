const removeSoftDelete = require("../../hooks/remove-softdelete");
const searchAdmin = require("./hooks/search-admin");
const { disallow } = require("feathers-hooks-common");
module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [],
    update: [disallow("external")],
    patch: [],
    remove: [removeSoftDelete()],
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
