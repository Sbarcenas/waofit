const registerOrders = require("./hooks/registers-orders");
const changeStatusShoppingCart = require("./hooks/change-status-shopping-cart");
const registerExpressProductsOrders = require("./hooks/register-express-products-orders");
const registerExpressProductsOrdersDetails = require("./hooks/register-express-products-orders-details");
const registerOrderHistory = require("./hooks/register-order-history");
const calculateShipping = require("./hooks/calculate-shipping");
const registerOrderCoffeeShop = require("./hooks/register-order-coffee-shop");
const searchAdmin = require("./hooks/search-admin");
const { fastJoin } = require("feathers-hooks-common");
const registerCoffeeOrder = require("./hooks/register-coffee-order");
const registerCoffeeOrderDetails = require("./hooks/register-coffee-order-details");

const ordersJoin = {
  joins: {
    join: () => async (records, context) => {
      const orderStatusModel = context.app.service("orders-status").getModel();
      const [expressProductsOrders, coffeeOrder] = await Promise.all([
        context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .where({
            order_id: records.id,
            user_id: context.params.user.id,
            deletedAt: null,
          })
          .then((it) => it[0]),
        context.app
          .service("coffee-orders")
          .getModel()
          .query()
          .where({
            order_id: records.id,
            user_id: context.params.user.id,
            deletedAt: null,
          })
          .then((it) => it[0]),
      ]);

      records.total_payment_received = await context.app
        .service("payment-confirmations")
        .getModel()
        .query()
        .sum("value as total")
        .where({
          status: "Aceptada",
          response: "Aprobada",
          deletedAt: null,
          order_id: records.id,
        })
        .then((it) => (it[0].total ? it[0].total : 0));

      records.total_payment_pending =
        records.total_price - records.total_payment_received;

      if (expressProductsOrders) {
        records.express_product_order = expressProductsOrders;

        records.express_product_order.status = await orderStatusModel
          .query()
          .where({
            id: expressProductsOrders.order_status_id,
            type: "express-products",
            deletedAt: null,
          })
          .then((it) => it[0]);

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
            .select(
              "express_products.id",
              "express_products.name",
              "express_products.price",
              "express_products.regular_price",
              "express_products.shop_type",
              "express_products.status",
              "express_products_media.source_path AS main_image",
              "express_products.type AS type",
              "express_products.regular_price",
              "express_products_media.id AS express_products_media_id",
              "express_products_media.type AS type_media"
            )
            .innerJoin(
              "express_products_media",
              "express_products.id",
              "=",
              "express_products_media.product_id"
            )
            .where({
              "express_products.id":
                expProductOrderDetails[index].express_product_id,
              "express_products_media.main": "true",
              "express_products_media.media_type": "normal",
              /* "express_products_media.type": "image", */
              "express_products_media.deletedAt": null,
            })
            .then((it) => it[0]);
          records.express_product_order.express_product_order_details[
            index
          ].product = product;
        }
      }
      if (coffeeOrder) {
        records.coffee_order = coffeeOrder;
        records.coffee_order.status = await orderStatusModel
          .query()
          .where({
            id: coffeeOrder.order_status_id,
            type: "coffee",
            deletedAt: null,
          })
          .then((it) => it[0]);
        const coffeeOrderDetails = await context.app
          .service("coffee-order-details")
          .find({
            query: { coffee_order_id: coffeeOrder.id },
            paginate: false,
          });

        records.coffee_order.coffee_order_details = coffeeOrderDetails;

        for (let index = 0; index < coffeeOrderDetails.length; index++) {
          const coffeeOrderDetail = coffeeOrderDetails[index];
          const product = await context.app
            .service("coffee-shop-products")
            .getModel()
            .query()
            .where({ id: coffeeOrderDetail.coffee_shop_product_id })
            .then((it) => it[0]);
          records.coffee_order.coffee_order_details[index].product = product;
        }
      }
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [registerOrders(), registerOrderCoffeeShop()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [fastJoin(ordersJoin)],
    get: [fastJoin(ordersJoin)],
    create: [
      registerOrderHistory(),
      changeStatusShoppingCart(),
      registerExpressProductsOrders(),
      registerExpressProductsOrdersDetails(),
      registerCoffeeOrder(),
      registerCoffeeOrderDetails(),
      calculateShipping(), //correrlo de ultimo
    ],
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
