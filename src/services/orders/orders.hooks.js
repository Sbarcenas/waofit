const registerOrders = require("./hooks/registers-orders");
const changeStatusShoppingCart = require("./hooks/change-status-shopping-cart");
const registerExpressProductsOrders = require("./hooks/register-express-products-orders");
const registerExpressProductsOrdersDetails = require("./hooks/register-express-products-orders-details");
const registerOrderHistory = require("./hooks/register-order-history");
const calculateShipping = require("./hooks/calculate-shipping");
const searchAdmin = require("./hooks/search-admin");

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
            deletedAt: null,
          })
          .then((it) => it[0]),
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
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [registerOrders()],
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
