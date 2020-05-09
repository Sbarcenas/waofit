// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    console.log("---------");

    records.shipment_of_scheduled_products = await context.app
      .service("calculate-next-delivery")
      .find();
    const userAdress = await context.app
      .service("users-addresses")
      .getModel()
      .query()
      .where({ user_id: context.params.user.id, main: "true" })
      .then((it) => it[0]);
    let msj = null;
    if (userAdress) {
      msj = await context.app
        .service("search-shipping-cost")
        .find({ query: { user_address_id: userAdress.id } })
        .then((it) => it.shippingCost);
    }
    records.shipping_cost = msj ? msj : false;
    if (context.params.products) {
      const shopping_cart_details = records.shopping_cart_details;
      for (let index = 0; index < shopping_cart_details.length; index++) {
        if (shopping_cart_details[index].shop_type == "express_product") {
          records.shopping_cart_details[index].product = await context.app
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
              "express_products.id":
                records.shopping_cart_details[index].product_id,
              "express_products.deletedAt": null,
              "express_products_media.main": "true",
              "express_products_media.media_type": "normal",
              /* "express_products_media.type": "image", */
              "express_products_media.deletedAt": null,
            })
            .then((it) => it[0]);
        }
      }
    }

    replaceItems(context, records);

    return context;
  };
};
