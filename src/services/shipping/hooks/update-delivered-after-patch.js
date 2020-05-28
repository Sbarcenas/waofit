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
      const coffeeOrdersModel = context.app
        .service("coffee-orders")
        .getModel()
        .query();
      const expressProductModel = context.app
        .service("express-products-orders")
        .getModel()
        .query();

      const [expressProduct, coffeeOrder] = await Promise.all([
        expressProductModel
          .where({ order_id: records.order_id })
          .whereIn("order_status_id", [14, 16, 10])
          .then((it) => it[0]),
        coffeeOrdersModel
          .where({ order_id: records.order_id })
          .whereIn("order_status_id", [27, 28, 25])
          .then((it) => it[0]),
      ]);

      if (!expressProduct && !coffeeOrder)
        throw new NotFound("No se encontró la orden.");

      //aqui van las demas condiciones para cambiar el estado de la orden principal
      let Express_product_order_status_id = null;
      if (expressProduct && expressProduct.order_status_id == 16) {
        Express_product_order_status_id = 20;
      } else if (expressProduct) {
        Express_product_order_status_id = 12;
        delivered = false;
      }

      if (expressProduct) {
        await Promise.all([
          expressProductModel
            .patch({ order_status_id: Express_product_order_status_id })
            .where({ id: expressProduct.id }),
          registerExpressProductsOrdersHistory({
            express_product_order_id: expressProduct.id,
            order_status_id: Express_product_order_status_id,
          })(context),
        ]);
      }

      let coffee_order_status_id = null;
      if (coffeeOrder && coffeeOrder.order_status_id == 28) {
        coffee_order_status_id = 29;
      } else {
        coffee_order_status_id = 26;
        delivered = false;
      }

      if (coffeeOrder) {
        await coffeeOrdersModel
          .patch({ order_status_id: coffee_order_status_id })
          .where({ id: coffeeOrder.id });
      }

      let order_status_id = null;
      const orderModel = context.app.service("orders").getModel().query();
      await orderModel
        .patch({ order_status_id: delivered ? 19 : 11 })
        .where({ id: records.order_id });

      registerOrderHistory({
        order_id: records.order_id,
        order_status_id: order_status_id,
      })(context);
    }

    replaceItems(context, records);

    return context;
  };
};
