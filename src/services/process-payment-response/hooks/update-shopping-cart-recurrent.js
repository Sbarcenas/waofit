// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const order = await context.app
      .service("orders")
      .getModel()
      .query()
      .where({ id: records.order_id })
      .then((it) => it[0]);

    if (order.recurrent == "false") return context;

    const recurringShoppingCart = await context.app
      .service("recurring-shopping-cart")
      .getModel()
      .query()
      .where({ id: order.shopping_cart_id })
      .then((it) => it[0]);

    let [time, quantityTime, dataPatch] = [null];

    switch (recurringShoppingCart.frequency) {
      case "7 days":
        quantityTime = 7;
        time = "days";
        break;

      case "15 days":
        quantityTime = 15;
        time = "days";
        break;

      case "1 month":
        quantityTime = 1;
        time = "months";
        break;

      default:
        break;
    }

    const friday = 5;
    const nextDelivery = moment()
      .add(quantityTime, time)
      .isoWeekday(friday)
      .format("YYYY-MM-DD");

    const last_payment_attempts =
      recurringShoppingCart.last_payment_attempts + 1;

    switch (records.response_code) {
      case 1:
        dataPatch = {
          next_delivery: nextDelivery,
          last_payment_attempts: 0,
          last_payment_meta_data: JSON.stringify(records.payment_info),
          last_payment_status: "acepted",
        };
        break;
      default:
        dataPatch = {
          next_delivery: nextDelivery,
          last_payment_attempts: last_payment_attempts,
          last_payment_meta_data: JSON.stringify(records.payment_info),
          last_payment_status:
            last_payment_attempts >= 11 ? "failed" : "rejected",
        };

        break;
    }

    await context.app
      .service("recurring-shopping-cart")
      .getModel()
      .query()
      .patch(dataPatch)
      .where({ id: recurringShoppingCart.id });

    replaceItems(context, records);

    return context;
  };
};
