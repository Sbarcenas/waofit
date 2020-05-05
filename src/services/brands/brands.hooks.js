const restictRemove = require("./hooks/restrict-remove");
const updateProductInAlgolia = require("./hooks/update-product-in-algolia");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const searchAdmin = require("./hooks/search-admin");

module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [],
    update: [],
    patch: [],
    remove: [restictRemove(), removeSoftDelete()],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [updateProductInAlgolia()],
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
