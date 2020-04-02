// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const { user } = context.params;

    let main = null;
    if (records.main == "true") {
      main = await context.app
        .service("users-addresses")
        .getModel()
        .query()
        .select("*")
        .where("main", "true")
        .where("user_id", user.id);
    }

    if (main && main.length > 0) {
      await context.app
        .service("users-addresses")
        .getModel()
        .query()
        .where({ user_id: user.id })
        .whereNot("id", records.id)
        .patch({
          main: "false"
        });
    }

    replaceItems(context, records);

    return context;
  };
};
