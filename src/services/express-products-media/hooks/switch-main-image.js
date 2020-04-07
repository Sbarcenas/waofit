// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    if (records.main == "true" || records.main == true) {
      await context.app
        .service("express-products-media")
        .getModel()
        .query()
        .update({ main: "false" })
        .whereNot({ id: records.id })
        .where({ product_id: records.product_id });
    }

    replaceItems(context, records);

    return context;
  };
};
