// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    if (records.shop_type != "express_product") return context;

    const [recurringShoppingCartDetails, product] = await Promise.all([
      context.app
        .service("recurring-shopping-cart-details")
        .getModel()
        .query()
        .where({
          recurring_shopping_cart_id: records.recurring_shopping_cart_id,
          product_id: records.product_id,
          shop_type: "express_product",
          deletedAt: null,
        })
        .then((it) => it[0]),
      context.app
        .service("express-products")
        .getModel()
        .query()
        .where({ id: records.product_id, deletedAt: null, status: "active" })
        .then((it) => it[0]),
    ]);

    if (recurringShoppingCartDetails)
      throw new NotAcceptable(
        "Ya tienes este producto agregado al carro de compras"
      );

    if (!product) throw new NotFound("No se encontró el producto.");

    if (product.quantity <= 0) throw new NotAcceptable("Producto sin stock.");

    if (product.quantity < records.quantity)
      throw new NotAcceptable("No hay suficiente de este producto.");

    replaceItems(context, records);

    return context;
  };
};
