const registerShoppingCart = require("./hooks/register-shopping-cart");
const registerExpressProduct = require("./hooks/register-express-product");
const registerExpressProductAfterCreate = require("./hooks/register-express-products-after-create");
const registerShoppingCartEmpty = require("./hooks/register-shopping-cart-empty");

const { disallow, paramsFromClient } = require("feathers-hooks-common");

const switchRegisterShoppingCartBefore = [
  paramsFromClient("shopping_cart_empty"),
  async context => {
    if (
      context.params.shopping_cart_empty == "true" ||
      context.params.shopping_cart_empty == true
    ) {
      return registerShoppingCartEmpty()(context);
    } else {
      return (
        await registerShoppingCart()(context),
        await registerExpressProduct()(context)
      );
    }
  }
];

const switchRegisterShoppingCartAfter = [
  paramsFromClient("shopping_cart_empty"),
  async context => {
    if (
      context.params.shopping_cart_empty == "true" ||
      context.params.shopping_cart_empty == true
    ) {
      return context;
    } else {
      console.log("en el after");
      return registerExpressProductAfterCreate()(context);
    }
  }
];

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [...switchRegisterShoppingCartBefore],
    update: [disallow("external")],
    patch: [disallow("external")],
    remove: [disallow("external")]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [...switchRegisterShoppingCartAfter],
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
