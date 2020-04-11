// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const { shippingDetails } = context;

    if (records.shipping_status_id == 2) {
      switch (records.type_sub_order) {
        case "express products":
          for (const shippingDetail of shippingDetails) {
            await context.app
              .service("express-products-orders-details")
              .getModel()
              .query()
              .where({ id: shippingDetail.sub_order_detail_id })
              .increment("sent", shippingDetail.quantity);
          }

          break;

        default:
          break;
      }
    }

    replaceItems(context, records);

    return context;
  };
};
