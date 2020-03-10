// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { user } = context.params;

    const records = getItems(context);

    const shoppingCart = await context.app
      .service("shopping-cart")
      .getModel()
      .query()
      .where({ user_id: user.id, status: "active", deletedAt: null })
      .then(it => it[0]);

    if (shoppingCart)
      throw new NotAcceptable("Ya tienes un carro de compras activo.");

    records.user_id = user.id;
    records.status = "active";

    replaceItems(context, records);

    return context;
  };
};
