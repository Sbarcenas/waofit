// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { user } = context.params;
    let records = getItems(context);

    if (user.role != "admin") {
      const author = await context.app
        .service("authors")
        .getModel()
        .query()
        .where({ user_id: user.id })
        .then(it => it[0]);

      if (author) throw new NotAcceptable("Ya eres un autor.");

      records.user_id = user.id;
      records.name = `${user.first_name} ${user.last_name}`;
    }

    replaceItems(context, records);

    return context;
  };
};
