// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const records = getItems(context);

    const { user } = context.params;

    let service = null;
    let query = null;
    switch (records.type) {
      case "product":
        service = "express-products";
        query = { id: records.type_id, deletedAt: null };
        break;
      case "brand":
        service = "brands";
        query = { id: records.type_id, deletedAt: null };
        break;
      case "blog":
        service = "blogs-and-guides";
        query = { id: records.type_id, deletedAt: null, type: "blog" };
        break;
      case "recipe":
        service = "recipes";
        query = { id: records.type_id, deletedAt: null };
        break;
      case "guide":
        service = "blogs-and-guides";
        query = { id: records.type_id, deletedAt: null, type: "guide" };
        break;
      default:
        break;
    }

    const item = await context.app
      .service(service)
      .getModel()
      .query()
      .where(query)
      .then((it) => it[0]);

    if (!item)
      throw new NotFound("No se encontró el item a marcar como favorito.");

    const favorite = await context.app
      .service("favorites")
      .getModel()
      .query()
      .where({
        type: records.type,
        type_id: records.type_id,
        user_id: user.id,
        deletedAt: null,
      })
      .then((it) => it[0]);

    if (favorite) throw new NotAcceptable("Ya hace parte de tus favoritos.");

    records.user_id = user.id;

    replaceItems(context, records);

    return context;
  };
};
