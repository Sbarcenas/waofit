const registerOrders = require("./hooks/registers-orders");
const changeStatusShoppingCart = require("./hooks/change-status-shopping-cart");
const registerExpressProductsOrders = require("./hooks/register-express-products-orders");
const registerExpressProductsOrdersDetails = require("./hooks/register-express-products-orders-details");
const registerOrderHistory = require("./hooks/register-order-history");

const { fastJoin } = require("feathers-hooks-common");

const ordersJoin = {
  joins: {
    join: () => async (records, context) => {
      const [expressProductsOrders] = await Promise.all([
        context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .where({
            order_id: records.id,
            deletedAt: null
          })
          .then(it => it[0])
      ]);
      if (expressProductsOrders) {
        records.express_product_order = expressProductsOrders;

        records.express_product_order.status = await context.app
          .service("orders-status")
          .getModel()
          .query()
          .where({
            id: expressProductsOrders.order_status_id,
            type: "express-products",
            deletedAt: null
          })
          .then(it => it[0]);

        records.express_product_order.express_product_order_details = await context.app
          .service("express-products-orders-details")
          .getModel()
          .query()
          .where({ express_product_order_id: expressProductsOrders.id });

        const expProductOrderDetails =
          records.express_product_order.express_product_order_details;

        for (let index = 0; index < expProductOrderDetails.length; index++) {
          const product = await context.app
            .service("express-products")
            .getModel()
            .query()
            .where({ id: expProductOrderDetails[index].express_product_id })
            .then(it => it[0]);
          records.express_product_order.express_product_order_details[
            index
          ].product = product;
        }
      }
    }
  }
};

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
    find: [fastJoin(ordersJoin)],
    get: [fastJoin(ordersJoin)],
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
