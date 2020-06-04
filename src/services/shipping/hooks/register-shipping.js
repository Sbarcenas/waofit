// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerOrderHistory = require("../../../hooks/register-order-history");
const registerExpressProductsOrdersHistory = require("../../../hooks/register-products-orders-history");
const registerCoffeeOrderHistory = require("../../../hooks/register-coffee-order-history");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    let subOrder = null;

    const orderModel = context.app.service("orders").getModel().query();

    const order = await orderModel
      .whereIn("order_status_id", [1, 5, 9, 11, 13])
      .where({ id: records.order_id, deletedAt: null })
      .then((it) => it[0]);

    if (
      order.order_status_id == 1 &&
      order.payment_method != "cash_on_delivery"
    )
      throw new NotAcceptable(
        "No se puede enviar la orden por que no esta para pagar en efectivo."
      );

    if (!order) throw new NotFound("No se encontró la orden.");

    switch (records.type_sub_order) {
      case "express products":
        const expressProductsOrderModel = context.app
          .service("express-products-orders")
          .getModel()
          .query();

        subOrder = await expressProductsOrderModel
          .where({
            id: records.sub_order_id,
            order_id: records.order_id,
            deletedAt: null,
          })
          .whereIn("order_status_id", [2, 6, 10, 12, 14])
          .then((it) => it[0]);

        if (!subOrder) throw new NotFound("No se encontró la Sub orden.");

        if (subOrder) {
          if (subOrder.order_status_id == 10)
            throw new NotAcceptable(
              "La sub orden se encuentra en preparación."
            );
        }

        await expressProductsOrderModel
          .patch({ order_status_id: 10 })
          .where({
            id: records.sub_order_id,
            order_id: records.order_id,
            deletedAt: null,
          })
          .whereIn("order_status_id", [2, 6]);

        await registerExpressProductsOrdersHistory({
          express_product_order_id: records.sub_order_id,
          order_status_id: 10,
        })(context);

        break;
      case "coffee":
        const coffeeOrderModel = context.app
          .service("coffee-orders")
          .getModel()
          .query();

        subOrder = await coffeeOrderModel
          .where({
            id: records.sub_order_id,
            order_id: records.order_id,
            deletedAt: null,
          })
          .whereIn("order_status_id", [21, 22, 25, 26, 27])
          .then((it) => it[0]);

        if (!subOrder) throw new NotFound("No se encontró la Sub orden.");

        if (subOrder) {
          if (subOrder.order_status_id == 25)
            throw new NotAcceptable(
              "La sub orden se encuentra en preparación."
            );
        }

        await coffeeOrderModel
          .patch({ order_status_id: 25 })
          .where({
            id: records.sub_order_id,
            order_id: records.order_id,
            deletedAt: null,
          })
          .whereIn("order_status_id", [21, 22]);

        await registerCoffeeOrderHistory({
          coffee_order_id: records.sub_order_id,
          order_status_id: 25,
        })(context);

        break;
      default:
        break;
    }

    await orderModel
      .patch({ order_status_id: 9 })
      .where({ id: records.order_id, deletedAt: null })
      .then((it) => it[0]);

    registerOrderHistory({
      order_id: records.order_id,
      order_status_id: 9,
    })(context);

    records.delivery_guy_user_id = user.id;
    records.shipping_status_id =
      order.payment_method == "cash_on_delivery" ? 4 : 1;

    records.pending_payment = 0;
    records.payment_received = 0;

    replaceItems(context, records);

    return context;
  };
};
