// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerExpressProductsOrdersHistory = require("../../../hooks/register-products-orders-history");
const registerOrderHistory = require("../../../hooks/register-order-history");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    let delivered = true;
    if (records.shipping_status_id == 3) {
      // aqui las demas consultas
      const [expressProduct] = await Promise.all([
        context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .where({ order_id: records.order_id })
          .whereIn("order_status_id", [14, 16])
          .then((it) => it[0]),
      ]);

      if (!expressProduct) throw new NotFound("No se encontró la orden.");

      //aqui van las demas condiciones para cambiar el estado de la orden principal
      let Express_product_order_status_id = null;
      if (expressProduct && expressProduct.order_status_id == 16) {
        Express_product_order_status_id = 20;
        //aqui actualizar la suborder como entregada pero tiendo en cuenta deben estar todos los envios que relacionen a ese detalle como shipping_status_id 3
        await context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .patch({ order_status_id: Express_product_order_status_id })
          .where({ id: expressProduct.id });
      } else {
        Express_product_order_status_id = 12;
        await context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .patch({ order_status_id: Express_product_order_status_id })
          .where({ id: expressProduct.id });
        delivered = false;
      }

      await registerExpressProductsOrdersHistory({
        express_product_order_id: expressProduct.id,
        order_status_id: Express_product_order_status_id,
      })(context);

      let order_status_id = null;

      if (delivered) {
        order_status_id = 19;
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: order_status_id })
          .where({ id: records.order_id });
      } else {
        order_status_id = 11;
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: order_status_id })
          .where({ id: records.order_id });
      }

      registerOrderHistory({
        order_id: records.order_id,
        order_status_id: order_status_id,
      })(context);
    }

    replaceItems(context, records);

    return context;
  };
};
