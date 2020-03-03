// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { user } = context.params;

    const records = getItems(context);

    const shoppingCart = await context.app
      .service("shopping-cart")
      .getModel()
      .query()
      .where({
        deletedAt: null,
        status: "active",
        user_id: user.id
      })
      .then(it => it[0]);

    if (!shoppingCart)
      throw new NotFound("No se encontró el carro de compras.");

    records.shopping_cart_id = shoppingCart.id;

    replaceItems(context, records);

    return context;
  };
};
