// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const records = getItems(context);
    const { user } = context.params;

    const query = null;
    if (context.method == "get") {
      query = { id: context.id, deletedAt: null };
    } else if (context.method == "find") {
      query = { deletedAt: null };
    }

    const coffeeOrderDetailsIds = await context.app
      .service("coffee-order-details")
      .getModel()
      .query()
      .where(query)
      .then((it) => it.map((it) => it.id));

    // const

    replaceItems(context, records);

    return context;
  };
};
