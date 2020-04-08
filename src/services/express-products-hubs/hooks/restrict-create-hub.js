// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const hub = await context.app
      .service("express-products-hubs")
      .getModel()
      .query()
      .where({
        product_id: records.product_id,
        hub_id: records.hub_id,
        deletedAt: null,
      })
      .then((it) => it[0]);

    if (hub)
      throw new NotAcceptable("Este producto ya tiene este hub asignado.");

    replaceItems(context, records);

    return context;
  };
};
