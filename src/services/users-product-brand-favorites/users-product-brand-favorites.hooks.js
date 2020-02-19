const usersProductsBrandFavorites = require("./hooks/users-product-brand-favorites-b-c");
const removeSoftDelete = require("../../hooks/remove-softdelete");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [usersProductsBrandFavorites()],
    update: [],
    patch: [],
    remove: [removeSoftDelete()]
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
