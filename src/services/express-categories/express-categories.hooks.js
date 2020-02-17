const updateProductInAlgolia = require("./hooks/update-product-in-algolia");
const restrictRemove = require("./hooks/restrict-remove");
const removeSoftdelete = require("../../hooks/remove-softdelete");
const expressCategoriesAfterFind = require("./hooks/express-categories-after-find");

const { iff, isProvider } = require("feathers-hooks-common");

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
    find: [expressCategoriesAfterFind()],
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
