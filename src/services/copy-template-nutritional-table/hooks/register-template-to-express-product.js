// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound } = require("@feathersjs/errors");
const { query } = require("../../../utils/query-builders/batch-insert");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const [productAssingTemplate, template] = await Promise.all([
      context.app
        .service("express-products")
        .getModel()
        .query()
        .where({ id: records.product_assing_template_id, deletedAt: null })
        .then(it => it[0]),
      context.app
        .service("express-products-nutritional-table")
        .getModel()
        .query()
        .select(
          "express_nu_ta_opt_id",
          "value",
          "value2",
          "parent_id",
          "section",
          "position",
          "json"
        )
        .where({
          product_id: records.product_copy_template_id,
          deletedAt: null
        })
        .then(it => it)
    ]);

    if (!productAssingTemplate)
      throw new NotFound(
        "No se encontró el producto al que se le va a asignar el template."
      );
    if (template.length < 1) throw new NotFound("No se encontró el template.");

    const data = template.map(it => ({
      ...it,
      product_id: records.product_assing_template_id,
      createdAt: moment().format("YYYY-MM-DD hh-mm-ss"),
      updatedAt: moment().format("YYYY-MM-DD hh-mm-ss")
    }));

    await context.app
      .service("express-products-nutritional-table")
      .getModel()
      .query()
      .where({ product_id: records.product_assing_template_id })
      .del();

    await query.insert(
      context.app.service("express-products-nutritional-table").getModel(),
      data
    );
    replaceItems(context, records);

    return context;
  };
};
