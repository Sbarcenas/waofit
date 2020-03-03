// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { user } = context.params;

    const records = getItems(context);

    if (records.quantity <= 0) throw new NotAcceptable("Cantidad no valida.");

    const shoppingCart = await context.app
      .service("shopping-cart")
      .getModel()
      .query()
      .where({ user_id: user.id, status: "active" })
      .then(it => it[0]);

    if (shoppingCart) throw new NotAcceptable("Tienes un carro activo.");

    replaceItems(context, records);

    return context;
  };
};
