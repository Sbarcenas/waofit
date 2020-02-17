// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    if (records.hub_ids.length < 1)
      throw new NotAcceptable("Debes enviar los ids de los hubs en un array.");

    const expressProduct = await Promise.all([
      context.app
        .service("express-products")
        .getModel()
        .query()
        .finOne({ where: { id: records.product_id, deletedAt: null } })
    ]);

    if (!expressProduct) throw new NotFound("No se encontró el producto.");

    await context.app
      .service("express-products-hubs")
      .getModel()
      .query()
      .where({ product_id: records.product_id, deletedAt: null })
      .del();

    replaceItems(context, records);

    return context;
  };
};
