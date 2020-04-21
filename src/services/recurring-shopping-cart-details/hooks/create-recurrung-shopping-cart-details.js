// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const recurringShoppingCart = await context.app
      .service("recurring-shopping-cart")
      .getModel()
      .query()
      .where({
        id: records.recurring_shopping_cart_id,
        user_id: user.id,
        deletedAt: null,
      })
      .then((it) => it[0]);

    if (!recurringShoppingCart)
      throw NotFound("No se encontró el carro de compras recurrente.");

    replaceItems(context, records);

    return context;
  };
};
