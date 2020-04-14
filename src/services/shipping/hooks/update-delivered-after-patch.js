// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    let delivered = true;
    if (records.shipping_status_id == 3) {
      // aqui las demas consultas
      const [expressProducts] = await Promise.all([
        context.app
          .service("shipping")
          .getModel()
          .query()
          .where({ order_id: records.order_id })
          .then((it) => it[0]),
      ]);

      //aqui van las demas condiciones para cambiar el estado de la orden principal
      if (expressProducts && expressProducts.order_status_id != 16) {
        //aqui actualizar la suborder como entregada pero tiendo en cuenta deben estar todos los envios que relacionen a ese detalle como shipping_status_id 3
        await context.app.service("").getModel().query().where({});
        delivered = false;
      }

      if (delivered) {
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: 19 })
          .where({ id: records.order_id });
      } else {
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: 11 })
          .where({ id: records.order_id });
      }
    }

    replaceItems(context, records);

    return context;
  };
};
