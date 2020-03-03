// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { user } = context.params;

    const records = getItems(context);

    if (records.shop_type !== "express_product") return context;

    const product = await context.app
      .service("express-products")
      .getModel()
      .query()
      .where({ id: records.product_id, deletedAt: null })
      .then(it => it[0]);

    if (!product) throw new NotFound("No se encontró el producto.");

    if (product.quantity < records.quantity)
      throw new NotAcceptable(
        "La cantidad supera el stock actual de este producto."
      );

    records.user_id = user.id;
    records.status = "active";

    context.shopping_cart_details = {
      quantity: records.quantity,
      shop_type: product.shop_type,
      product_id: product.id
    };

    delete records.product_id;
    delete records.quantity;
    delete records.shop_type;

    replaceItems(context, records);

    return context;
  };
};
