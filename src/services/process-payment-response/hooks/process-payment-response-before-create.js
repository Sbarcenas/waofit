// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerExpressProductsOrdersHistory = require("../../../hooks/register-products-orders-history");
const registerOrderHistory = require("../../../hooks/register-order-history");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const { user } = context.params;

    const [expressProductOrder] = await Promise.all([
      context.app
        .service("express-products-orders")
        .getModel()
        .query()
        .where({ order_id: records.order_id, deletedAt: null })
        .then(it => it[0])
    ]);

    switch (records.response_code) {
      //PAGO EXITOSO
      case 1:
        console.log("Pago  realizado con exito");

        await Promise.all([
          context.app
            .service("orders")
            .getModel()
            .query()
            .patch({ order_status_id: 5 })
            .where({ id: expressProductOrder.order_id }),
          registerOrderHistory({
            order_id: records.order_id,
            order_status_id: 5
          })(context)
        ]);

        if (expressProductOrder) {
          //actualizamos el estado de la orden como canceladay guardamos su historial
          await Promise.all([
            context.app
              .service("express-products-orders")
              .getModel()
              .query()
              .patch({ order_status_id: 6 })
              .where({ id: expressProductOrder.id }),
            registerExpressProductsOrdersHistory({
              express_product_order_id: expressProductOrder.id,
              order_status_id: 6
            })(context)
          ]);
        }
        break;

      case 2:
        //PAGO RECHAZADO
        console.log("Pago rechazado");
        //se tiene que guardar en el historial el pago rechazado
        await Promise.all([
          context.app
            .service("orders")
            .getModel()
            .query()
            .patch({ order_status_id: 3 })
            .where({ id: expressProductOrder.order_id }),
          registerOrderHistory({
            order_id: records.order_id,
            order_status_id: 3
          })(context)
        ]);

        if (expressProductOrder) {
          //actualizamos el estado de la orden como canceladay guardamos su historial
          await Promise.all([
            context.app
              .service("express-products-orders")
              .getModel()
              .query()
              .patch({ order_status_id: 4 })
              .where({ id: expressProductOrder.id }),
            registerExpressProductsOrdersHistory({
              express_product_order_id: expressProductOrder.id,
              order_status_id: 4
            })(context)
          ]);
        }
        break;

      case 3:
        //PAGO RECHAZADO
        console.log("Pago pendiente");
        //se tiene que guardar en el historial el pago rechazado

        await Promise.all([
          context.app
            .service("orders")
            .getModel()
            .query()
            .patch({ order_status_id: 7 })
            .where({ id: expressProductOrder.order_id }),
          registerOrderHistory({
            order_id: records.order_id,
            order_status_id: 7
          })(context)
        ]);

        if (expressProductOrder) {
          //actualizamos el estado de la orden como canceladay guardamos su historial
          await Promise.all([
            context.app
              .service("express-products-orders")
              .getModel()
              .query()
              .patch({ order_status_id: 8 })
              .where({ id: expressProductOrder.id }),
            registerExpressProductsOrdersHistory({
              express_product_order_id: expressProductOrder.id,
              order_status_id: 8
            })(context)
          ]);
        }
        break;

      default:
        //PAGO RECHAZADO
        console.log("Pago rechazado respuesta mayor a 3");
        //se tiene que guardar en el historial el pago rechazado
        await Promise.all([
          context.app
            .service("orders")
            .getModel()
            .query()
            .patch({ order_status_id: 3 })
            .where({ id: expressProductOrder.order_id }),
          registerOrderHistory({
            order_id: records.order_id,
            order_status_id: 3
          })(context)
        ]);

        if (expressProductOrder) {
          //actualizamos el estado de la orden como canceladay guardamos su historial
          await Promise.all([
            context.app
              .service("express-products-orders")
              .getModel()
              .query()
              .patch({ order_status_id: 4 })
              .where({ id: expressProductOrder.id }),
            registerExpressProductsOrdersHistory({
              express_product_order_id: expressProductOrder.id,
              order_status_id: 4
            })(context)
          ]);
        }
        break;
    }

    replaceItems(context, records);

    return context;
  };
};
