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
      console.log("---------");
      await Promise.all([
        context.app
          .service("shipping")
          .getModel()
          .query()
          .where({ id: records.shipping_id })
          .increment("payment_received", records.value),
        context.app
          .service("shipping")
          .getModel()
          .query()
          .where({ id: records.shipping_id })
          .decrement("pending_payment", records.value),
      ]);
    }

    replaceItems(context, records);

    return context;
  };
};
