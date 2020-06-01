// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerExpressProductsOrdersHistory = require("../../../hooks/register-products-orders-history");
const registerOrderHistory = require("../../../hooks/register-order-history");
const discountStockProductuExpress = require("../../../hooks/discount-stock-express-products");
const registerCoffeeOrderHistory = require("../../../hooks/register-coffee-order-history");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;
    const [expressProductOrder, order, coffeeOrder] = await Promise.all([
      context.app
        .service("express-products-orders")
        .getModel()
        .query()
        .where({ order_id: records.order_id, deletedAt: null })
        .then((it) => it[0]),
      context.app
        .service("orders")
        .getModel()
        .query()
        .where({ id: records.order_id })
        .then((it) => it[0]),
      context.app
        .service("coffee-orders")
        .getModel()
        .query()
        .where({ order_id: records.order_id, deletedAt: null })
        .then((it) => it[0]),
    ]);

    let [order_status_id, express_product_status_id, coffee_status_id] = [null];
    switch (records.response_code) {
      //PAGO EXITOSO
      case 1:
        console.log("Pago  realizado con exito");
        order_status_id = 5;
        express_product_status_id = 6;
        coffee_status_id = 22;
        try {
          await discountStockProductuExpress({
            express_product_order_id: expressProductOrder.id,
          })(context);
        } catch (error) {
          console.log(error);
        }

        //actualizando los pagos recurrentes

        break;

      case 2:
        //PAGO RECHAZADO
        console.log("Pago rechazado");
        order_status_id = 3;
        express_product_status_id = 4;
        coffee_status_id = 23;
        //se tiene que guardar en el historial el pago rechazado

        break;

      case 3:
        //PAGO PENDIENTE
        console.log("Pago pendiente");
        order_status_id = 7;
        express_product_status_id = 8;
        coffee_status_id = 24;
        //se tiene que guardar en el historial el pago rechazado
        break;

      default:
        //PAGO RECHAZADO
        console.log("Pago rechazado respuesta mayor a 3");
        order_status_id = 3;
        express_product_status_id = 4;
        coffee_status_id = 23;
        break;
    }

    await Promise.all([
      context.app
        .service("orders")
        .getModel()
        .query()
        .patch({ order_status_id: order_status_id })
        .where({ id: expressProductOrder.order_id }),
      registerOrderHistory({
        order_id: records.order_id,
        order_status_id: order_status_id,
      })(context),
    ]);

    if (expressProductOrder) {
      //actualizamos el estado de la orden como canceladay guardamos su historial
      await Promise.all([
        context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .patch({ order_status_id: express_product_status_id })
          .where({ id: expressProductOrder.id })
          .then((it) => it),
        registerExpressProductsOrdersHistory({
          express_product_order_id: expressProductOrder.id,
          order_status_id: express_product_status_id,
          user_id: order.user_id,
        })(context),
      ]);
    }

    if (coffeeOrder) {
      await Promise.all([
        context.app
          .service("coffee-orders")
          .getModel()
          .query()
          .patch({ order_status_id: coffee_status_id })
          .where({ id: coffeeOrder.id })
          .then((it) => it),
        await registerCoffeeOrderHistory({
          coffee_order_id: coffeeOrder.id,
          order_status_id: coffee_status_id,
          user_id: order.user_id,
        })(context),
      ]);
    }

    context.data = {
      order: order,
      responseCode: records.response_code,
      paymentInfo: records.payment_info,
    };

    replaceItems(context, records);

    return context;
  };
};
