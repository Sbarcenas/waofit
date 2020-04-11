// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    let subOrder = null;
    switch (records.type_sub_order) {
      case "express products":
        subOrder = await context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .where({
            id: records.sub_order_id,
            order_id: records.order_id,
            order_status_id: 6,
          })
          .then((it) => it[0]);

        break;

      default:
        break;
    }

    if (!subOrder) throw new NotFound("No se encontró la orden");

    records.delivery_guy_user_id = user.id;
    records.shipping_status_id = 1;

    replaceItems(context, records);

    return context;
  };
};
