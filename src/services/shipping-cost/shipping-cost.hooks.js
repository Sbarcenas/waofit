const searhShippingCost = require("./hooks/search-shipping-cost");

module.exports = {
  before: {
    all: [],
    find: [searhShippingCost()],
    get: [searhShippingCost()],
    create: [],
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
