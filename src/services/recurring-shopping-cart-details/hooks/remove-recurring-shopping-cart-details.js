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

    const recurringShoppingCartDetails = await context.app
      .service("recurring-shopping-cart-details")
      .getModel()
      .query()
      .where({ id: context.id, deletedAt: null })
      .then((it) => it[0]);

    if (!recurringShoppingCartDetails)
      throw new NotAcceptable(
        "No se encontró el detalle del carro de compras recurrente."
      );

    const recurringShoppingCart = await context.app
      .service("recurring-shopping-cart")
      .getModel()
      .query()
      .where({
        id: recurringShoppingCartDetails.recurring_shopping_cart,
        user_id: user.id,
        deletedAt: null,
      })
      .then((it) => it[0]);

    if (recurringShoppingCart)
      throw new NotAcceptable(
        "No puedes elmininar este carro de compras recurrente."
      );

    replaceItems(context, records);

    return context;
  };
};
