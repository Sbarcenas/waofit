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

    subOrder = await context.app
      .service("express-products-orders")
      .getModel()
      .query()
      .where({
        id: records.sub_order_id,
        order_id: records.order_id,
        deletedAt: null,
      })
      .whereIn("order_status_id", [6, 10, 12, 14])
      .then((it) => it[0]);

    if (subOrder) {
      if (subOrder.order_status_id == 10)
        throw new NotAcceptable("La sub orden se encuentra en preparación.");
    }

    await context.app
      .service("express-products-orders")
      .getModel()
      .query()
      .patch({ order_status_id: 10 })
      .where({
        id: records.sub_order_id,
        order_id: records.order_id,
        order_status_id: 6,
        deletedAt: null,
      });

    if (!subOrder) throw new NotFound("No se encontró la orden.");

    const order = await context.app
      .service("orders")
      .getModel()
      .query()
      .where({ id: records.order_id, order_status_id: 5, deletedAt: null })
      .then((it) => it[0]);

    if (order) {
      await context.app
        .service("orders")
        .getModel()
        .query()
        .patch({ order_status_id: 9 })
        .where({ id: records.order_id, deletedAt: null })
        .then((it) => it[0]);
    }

    records.delivery_guy_user_id = user.id;
    records.shipping_status_id = 1;

    replaceItems(context, records);

    return context;
  };
};
