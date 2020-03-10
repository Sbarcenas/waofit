const registerShoppingCart = require("./hooks/register-shopping-cart");
const registerExpressProduct = require("./hooks/register-express-product");
const registerExpressProductAfterCreate = require("./hooks/register-express-products-after-create");
const registerShoppingCartEmpty = require("./hooks/register-shopping-cart-empty");

const {
  disallow,
  paramsFromClient,
  fastJoin
} = require("feathers-hooks-common");

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

const productsJoins = {
  joins: {
    role: () => async (records, context) => {
      if (context.params.products) {
        const shopping_cart_details = records.shopping_cart_details;
        for (let index = 0; index < shopping_cart_details.length; index++) {
          if (shopping_cart_details[index].shop_type == "express_product") {
            records.shopping_cart_details[index].product = await context.app
              .service("express-products")
              .getModel()
              .query()
              .where({ id: records.shopping_cart_details[index].product_id })
              .then(it => it[0]);
          }
        }
      }
    }
  }
};

module.exports = {
  before: {
    all: [],
    find: [paramsFromClient("products")],
    get: [paramsFromClient("products")],
    create: [...switchRegisterShoppingCartBefore],
    update: [disallow("external")],
    patch: [disallow("external")],
    remove: [disallow("external")]
  },

  after: {
    all: [],
    find: [fastJoin(productsJoins)],
    get: [fastJoin(productsJoins)],
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
