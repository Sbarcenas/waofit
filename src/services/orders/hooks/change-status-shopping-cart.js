// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const { user } = context.params;

    if (context.changeStatusShoppingCart)
      /* await context.app
        .service("shopping-cart")
        .getModel()
        .query()
        .patch({ status: "completed" })
        .where({ id: records.shopping_cart_id }); */

      console.log("HAY QUE CAMBIAR EL ESTADO DEL CARRO DE COMPRAS");

    replaceItems(context, records);

    return context;
  };
};
