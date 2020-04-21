// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (records.status == "active") {
      //   const recurringShoppingCart = await context.app
      //     .service("recurring-shopping-cart")
      //     .getModel()
      //     .query()
      //     .where({ id: context.id })
      //     .then((it) => it[0]);

      const nextDelivery = await context.app
        .service("calculate-next-delivery")
        .find()
        .then((it) => moment(it.next_delivery).format("YYYY-MM-DD"));

      await context.app
        .service("recurring-shopping-cart")
        .getModel()
        .query()
        .patch({ next_delivery: nextDelivery })
        .where({ id: context.id })
        .then((it) => it[0]);
    }

    replaceItems(context, records);

    return context;
  };
};
