const createRecurringShoppingCart = require("./hooks/create-recurring-shopping-cart");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const activateRecurrindShoppingCart = require("./hooks/activate-recurring-shopping-cart");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [createRecurringShoppingCart()],
    update: [],
    patch: [activateRecurrindShoppingCart()],
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
