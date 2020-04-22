// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const records = getItems(context);

    const { user } = context.params;

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
