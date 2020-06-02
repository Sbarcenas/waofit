// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (!records.shipping_id) throw new NotAcceptable("Debes enviar el envio.");

    if (records.bank == "dataphone") {
      if (!records.payment_reference)
        throw new NotAcceptable("Debes enviar la refefencia de pago.");
    }

    if (!records.description)
      throw new NotAcceptable("Debes enviar la descripción.");

    if (!records.value) throw new NotAcceptable("Debes enviar el valor.");

    const shipping = await context.app
      .service("shipping")
      .getModel()
      .query()
      .where({ id: records.shipping_id, deletedAt: null })
      .then((it) => it[0]);

    const order = await context.app
      .service("orders")
      .getModel()
      .query()
      .where({ id: shipping.order_id, deletedAt: null })
      .then((it) => it[0]);

    if (!order) throw new NotFound("Orden no encontrada.");

    records.invoice = `FitHub-${order.id}`;
    records.status = "Aceptada";
    records.response = "Aprobada";

    replaceItems(context, records);

    return context;
  };
};
