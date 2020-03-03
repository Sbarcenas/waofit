const registerShoppingCartDetails = require("./hooks/register-shopping-cart-details");
const registerExpressProduct = require("./hooks/register-express-product");
const patchExpressProduct = require("./hooks/patch-express-product");
const { discard, iff, isProvider } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerShoppingCartDetails(), registerExpressProduct()],
    update: [],
    patch: [
      iff(
        isProvider("external"),
        discard("shopping_cart_id", "shop_type", "product_id", "deletedAt")
      ),
      patchExpressProduct()
    ],
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
