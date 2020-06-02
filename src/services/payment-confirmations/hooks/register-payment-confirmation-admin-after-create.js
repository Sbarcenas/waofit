// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (records.bank == "dataphone" || records.bank == "cash") {
      await context.app
        .service("shipping")
        .getModel()
        .query()
        .patch({ payment_received: records.value })
        .where({ id: records.shipping_id });
    }

    replaceItems(context, records);

    return context;
  };
};
