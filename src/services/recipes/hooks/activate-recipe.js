// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;
    let records = getItems(context);

    if (records.status == "active") {
      const recipe = await context.app
        .service("recipes")
        .getModel()
        .query()
        .where({ id: context.id })
        .then((it) => it[0]);

      if (!recipe.path_preparation_video && !recipe.preparation_description)
        throw new NotAcceptable(
          "Para poder activar una receta debe tener una descripcion en texto o un video."
        );
    }
    if (!recipe.image_cover)
      throw new NotAcceptable(
        "No se puede activar la receta por que no tiene una imagen de cover."
      );

    replaceItems(context, records);

    return context;
  };
};
