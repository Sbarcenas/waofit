// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { query } = require("../../../utils/query-builders/batch-insert");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    if (records.hubs_id) return context;
    if (records.hub_ids.length < 1)
      throw new NotAcceptable("Debes enviar los ids de los hubs en un array.");

    const [expressProduct, hubs] = await Promise.all([
      context.app
        .service("express-products")
        .getModel()
        .query()
        .where({ id: records.product_id, deletedAt: null })
        .then((it) => it[0]),
      context.app
        .service("express-hubs")
        .getModel()
        .query()
        .whereIn("id", records.hub_ids)
        .where({ deletedAt: null }),
    ]);

    if (!expressProduct) throw new NotFound("No se encontró el producto.");

    await context.app
      .service("express-products-hubs")
      .getModel()
      .query()
      .where({ product_id: records.product_id, deletedAt: null })
      .del();

    if (hubs.length != records.hub_ids.length)
      throw new NotFound("No se encontro uno de hubs enviados.");

    const data = records.hub_ids.map((it) => ({
      hub_id: it,
      product_id: records.product_id,
    }));

    await query.insert(
      context.app.service("express-products-hubs").getModel(),
      data
    );

    context.result = [expressProduct];

    replaceItems(context, records);

    return context;
  };
};
