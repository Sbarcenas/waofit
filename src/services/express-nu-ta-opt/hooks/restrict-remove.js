// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const expressProductNutritionalTable = await context.app
      .service("express-products-nutritional-table")
      .getModel()
      .query()
      .where({ express_nu_ta_opt_id: context.id, deletedAt: null })
      .then(it => it[0]);

    if (expressProductNutritionalTable)
      throw new NotAcceptable(
        "No se puede eliminar esta opción por que algunos productos la estan usando."
      );

    replaceItems(context, records);

    return context;
  };
};
