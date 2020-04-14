// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (!context.id) throw new NotAcceptable("Debes enviar el id.");

    const shipping = await context.app
      .service("shipping")
      .getModel()
      .query()
      .where({ id: context.id })
      .then((it) => it[0]);

    if (!shipping) throw new NotFound("No se encontró el envío.");

    if (records.shipping_status_id == 3) {
      console.log("------------");
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

      console.log(shippings);
      console.log(shippingsSent);

      if (shippings.length === shippingsSent.length) {
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: 19 })
          .where({ id: shipping.order_id });
      } else {
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: 11 })
          .where({ id: shipping.order_id });
      }
    }

    replaceItems(context, records);

    return context;
  };
};
