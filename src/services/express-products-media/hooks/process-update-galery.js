// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const expressProductMedia = await context.app
      .service("express-products-media")
      .getModel()
      .query()
      .where({ id: context.id })
      .then((it) => it[0]);

    if (!expressProductMedia)
      throw new NotFound("No se encontró la multimedia.");

    replaceItems(context, records);

    return context;
  };
};
