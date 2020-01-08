const usersProductsBrandFavorites = require('./hooks/users-product-brand-favorites-b-c')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      usersProductsBrandFavorites()
    ],
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
