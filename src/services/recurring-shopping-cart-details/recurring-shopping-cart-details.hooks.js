const registerExpressProduct = require("./hooks/register-express-product");
const createRecurringShoppingCardDetails = require("./hooks/create-recurrung-shopping-cart-details");
const updateRecurringShoppingCartDetails = require("./hooks/update-recurring-shopping-cart-details");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const { fastJoin } = require("feathers-hooks-common");
const { discard, iff, isProvider } = require("feathers-hooks-common");

const resolves = {
  joins: {
    role: () => async (records, context) => {
      records.user_address = await context.app
        .service("users-addresses")
        .getModel()
        .query()
        .where({ user_id: context.params.user.id, main: "true" })
        .then((it) => it[0]);

      if (records.shop_type == "express_product") {
        records.product = await context.app
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
            "express_products.type AS type",
            "express_products.regular_price",
            "express_products_media.type AS type_media",
            "express_products_media.source_path AS main_image",
            "express_products_media.video_cover_path",
            "express_products_media.id AS express_products_media_id"
          )
          .innerJoin(
            "express_products_media",
            "express_products.id",
            "=",
            "express_products_media.product_id"
          )
          .where({
            "express_products.id": records.product_id,
            "express_products.deletedAt": null,
            "express_products_media.main": "true",
            "express_products_media.media_type": "normal",
            /* "express_products_media.type": "image", */
            "express_products_media.deletedAt": null,
          })
          .then((it) => it[0]);
      }
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerExpressProduct(), createRecurringShoppingCardDetails()],
    update: [],
    patch: [
      iff(
        isProvider("external"),
        discard(
          "recurring_shopping_cart_id",
          "shop_type",
          "product_id",
          "deletedAt"
        )
      ),
      updateRecurringShoppingCartDetails(),
    ],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
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
