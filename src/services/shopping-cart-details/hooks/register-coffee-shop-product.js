// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    if (records.shop_type != "coffee") return context;

    const [product] = await Promise.all([
      context.app
        .service("coffee-shop-products")
        .getModel()
        .query()
        .where({ id: records.product_id, deletedAt: null, status: "active" })
        .then((it) => it[0]),
    ]);

    if (records.coffee_shop_products_attributes.length < 1)
      throw new NotAcceptable("Debes enviar los atributos del producto.");

    if (!product) throw new NotFound("No se encontró el producto.");

    context.coffee_shop_products_attributes =
      records.coffee_shop_products_attributes;
    context.coffee_shop_product = product;

    delete records.coffee_shop_products_attributes;

    replaceItems(context, records);

    return context;
  };
};
