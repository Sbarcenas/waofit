const registerOrders = require("./hooks/registers-orders");
const changeStatusShoppingCart = require("./hooks/change-status-shopping-cart");
const registerExpressProductsOrders = require("./hooks/register-express-products-orders");
const registerExpressProductsOrdersDetails = require("./hooks/register-express-products-orders-details");
const registerOrderHistory = require("./hooks/register-order-history");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerOrders()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      registerOrderHistory(),
      changeStatusShoppingCart(),
      registerExpressProductsOrders(),
      registerExpressProductsOrdersDetails()
    ],
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
