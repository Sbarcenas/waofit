const updateProductInAlgolia = require("./hooks/update-product-in-algolia");
const restrictRemove = require("./hooks/restrict-remove");
const removeSoftdelete = require("../../hooks/remove-softdelete");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [restrictRemove(), removeSoftdelete()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [updateProductInAlgolia()],
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
