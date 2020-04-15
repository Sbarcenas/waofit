// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerOrderHistory = require("../../../hooks/register-order-history");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (!context.id) throw new NotAcceptable("Debes enviar el id.");

    if (records.shipping_status_id == 3) {
      const shipping = await context.app
        .service("shipping")
        .getModel()
        .query()
        .where({ id: context.id, shipping_status_id: 2 })
        .then((it) => it[0]);

      if (!shipping) throw new NotFound("No se encontró el envío.");

      const [shippings, shippingsSent] = await Promise.all([
        context.app
          .service("shipping")
          .getModel()
          .query()
          .where({ order_id: shipping.order_id })
          .then((it) => it),
        context.app
          .service("shipping")
          .getModel()
          .query()
          .where({ order_id: shipping.order_id, shipping_status_id: 3 })
          .then((it) => it),
      ]);

      //se actualiza la orden a entregada o entregada parcialmente
      let order_status_id = null;
      if (shippings.length === shippingsSent.length) {
        order_status_id = 19;
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: order_status_id })
          .where({ id: shipping.order_id });
      } else {
        order_status_id = 11;
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: order_status_id })
          .where({ id: shipping.order_id });
      }

      registerOrderHistory({
        order_id: shipping.order_id,
        order_status_id: order_status_id,
      })(context);
    }

    replaceItems(context, records);

    return context;
  };
};
