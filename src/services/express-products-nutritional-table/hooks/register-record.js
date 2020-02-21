// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const [expressNuTaOpt, product, expressProductNuTaOpt] = await Promise.all([
      context.app
        .service("express-nu-ta-opt")
        .getModel()
        .query()
        .where({ id: records.express_nu_ta_opt_id, deletedAt: null })
        .then(it => it[0]),
      context.app
        .service("express-products")
        .getModel()
        .query()
        .where({ id: records.product_id, deletedAt: null })
        .then(it => it[0]),
      context.app
        .service("express-products-nutritional-table")
        .getModel()
        .query()
        .where({
          product_id: records.product_id,
          express_nu_ta_opt_id: records.express_nu_ta_opt_id,
          section: records.section,
          deletedAt: null
        })
        .then(it => it[0])
    ]);

    if (records.parent_id > 0) {
      const parent = await context.app
        .service("express-products-nutritional-table")
        .getModel()
        .query()
        .where({
          id: records.parent_id,
          deletedAt: null,
          section: records.section
        })
        .then(it => it[0]);

      if (!parent)
        throw new NotAcceptable(
          "No se puede agregar esta option, por que no existe el padre."
        );
    }

    /* const positicionUsed = await context.app
      .service("express-products-nutritional-table")
      .getModel()
      .query()
      .where({
        parent_id: records.parent_id,
        section: records.section,
        position: records.position,
        product_id: records.product_id,
        deletedAt: null
      })
      .then(it => it[0]);

    if (positicionUsed)
      throw new NotAcceptable("La posición ya esta usada para este segmento."); */

    if (!expressNuTaOpt) throw new NotFound("No se encontró la option.");
    if (!product) throw new NotFound("No se encontró el producto.");
    if (expressProductNuTaOpt)
      throw new NotAcceptable(
        "Este producto ya tiene asignada esta información nutricional en la misma sección."
      );

    replaceItems(context, records);

    return context;
  };
};
