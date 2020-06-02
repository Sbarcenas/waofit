const registerFavorite = require("./hooks/register-favorite");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const { disallow, fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      let service = null;
      let query = null;
      switch (records.type) {
        case "product":
          service = "express-products";
          query = { id: records.type_id, deletedAt: null };
          break;
        case "brand":
          service = "brands";
          query = { id: records.type_id, deletedAt: null };
          break;
        case "blog":
          service = "blogs-and-guides";
          query = { id: records.type_id, deletedAt: null, type: "blog" };
          break;
        case "recipe":
          service = "recipes";
          query = { id: records.type_id, deletedAt: null };
          break;
        case "guide":
          service = "blogs-and-guides";
          query = { id: records.type_id, deletedAt: null, type: "guide" };
          break;
        case "coffee-shop-product":
          service = "coffee-shop-products";
          query = {
            id: records.type_id,
            deletedAt: null,
            type: "coffee-shop-product",
          };
          break;
        default:
          break;
      }

      if (
        service == "brand" ||
        service == "blog" ||
        service == "recipe" ||
        service == "recipe"
      ) {
        records.favorite = await context.app
          .service(service)
          .getModel()
          .query()
          .where(query)
          .then((it) => it[0]);
      } else if (service == "express-products")
        records.favorite = await context.app
          .service(service)
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
            "express_products.id": records.type_id,
            "express_products.deletedAt": null,
            "express_products_media.main": "true",
            "express_products_media.media_type": "normal",
            /* "express_products_media.type": "image", */
            "express_products_media.deletedAt": null,
          })
          .then((it) => it[0]);
      else if (service == "coffee-shop-products")
        records.favorite = await context.app
          .service(service)
          .getModel()
          .query()
          .select(
            "coffee_shop_products.id",
            "coffee_shop_products.name",
            "coffee_shop_products.price",
            "coffee_shop_products.type",
            "coffee_shop_products.status",
            "coffee_shop_products.image_path"
          )
          .where({
            "coffee_shop_products.id": records.type_id,
            "coffee_shop_products.deletedAt": null,
          })
          .then((it) => it[0]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerFavorite()],
    update: [],
    patch: [disallow("external")],
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
