const registerCoffeeProduct = require("./hooks/register-coffee-product");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerCoffeeProduct()],
    update: [],
    patch: [],
    remove: [],
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
