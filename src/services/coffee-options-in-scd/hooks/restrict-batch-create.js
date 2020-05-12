// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;
    let records = getItems(context);

    const shoppingCartDetails = await context.app
      .service("shopping-cart-details")
      .getModel()
      .query()
      .where({ id: records.shopping_cart_details_id, deletedAt: null })
      .then((it) => it[0]);

    let query;
    if (user.role != "admin")
      query = {
        id: shoppingCartDetails.id,
        user_id: user.id,
        deletedAt: null,
      };
    else
      query = {
        id: shoppingCartDetails.id,
        deletedAt: null,
      };
    const [product, shoppingCart] = await Promise.all([
      context.app
        .service("coffee-shop-products")
        .getModel()
        .query()
        .where({ id: records.product_id, deletedAt: null, status: "active" })
        .then((it) => it[0]),
      context.app
        .service("shopping-cart")
        .getModel()
        .query()
        .where(query)
        .then((it) => it[0]),
    ]);

    if (shoppingCart) throw new NotFound("No se encontró el carro de compras.");
    if (!product) throw new NotFound("No se encontró el producto.");
    if (records.coffee_products_attrib.length < 1)
      throw new NotAcceptable("Debes enviar los atributos del producto.");

    context.coffee_shop_product = product;
    context.coffee_products_attrib = records.coffee_products_attrib;

    replaceItems(context, records);

    return context;
  };
};
