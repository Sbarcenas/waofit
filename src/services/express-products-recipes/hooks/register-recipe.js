// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const [expressProduct, recipe] = await Promise.all([
      context.app
        .service("express-products")
        .getModel()
        .query()
        .where({ id: records.express_product_id, deletedAt: null })
        .then((it) => it[0]),
      context.app
        .service("recipes")
        .getModel()
        .query()
        .where({ id: records.recipe_id, deletedAt: null })
        .then((it) => it[0]),
    ]);

    if (!expressProduct) throw new NotFound("Producto no encontrado.");
    if (!recipe) throw new NotFound("No se encontró la receta.");

    replaceItems(context, records);

    return context;
  };
};
