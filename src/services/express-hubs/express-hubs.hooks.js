const switchPrepareUpdateAlgolia = require("./hooks/switch-prepare-update-algolia");
const updateAlgolia = require("./hooks/update-algolia");
const restringDelete = require("./hooks/restrict-delete");
const removeSoftDelete = require("../../hooks/remove-softdelete");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [switchPrepareUpdateAlgolia()],
    remove: [restringDelete(), removeSoftDelete()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [updateAlgolia()],
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
