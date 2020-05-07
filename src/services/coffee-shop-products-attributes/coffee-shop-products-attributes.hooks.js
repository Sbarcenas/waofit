const registerCoffeeShopProductsAttributes = require("./hooks/register-coffee-shop-products-attributes");
const updateCoffeeProductsAttributes = require("./hooks/update-coffee-shop-products-attributes");
const removeSoftdelete = require("../../hooks/remove-softdelete");
const { disallow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerCoffeeShopProductsAttributes()],
    update: [disallow("external")],
    patch: [updateCoffeeProductsAttributes()],
    remove: [removeSoftdelete()],
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
