// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerExpressProductsOrdersHistory = require("../../../hooks/register-products-orders-history");
const registerOrderHistory = require("../../../hooks/register-order-history");
const registerCoffeeOrderHistory = require("../../../hooks/register-coffee-order-history");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const { shippingDetails } = context;

    if (records.shipping_status_id == 2 || records.shipping_status_id == 5) {
      let [expressProductsComplete, coffeeComplete] = [true, true];
      let [buyItems, sentItems] = [null, null];

      const expressProductOrderDetailsModel = context.app
        .service("express-products-orders-details")
        .getModel()
        .query();
      switch (records.type_sub_order) {
        case "express products":
          for (const shippingDetail of shippingDetails) {
            const expressProductOrderDetails = await expressProductOrderDetailsModel
              .where({ id: shippingDetail.sub_order_detail_id })
              .then((it) => it[0]);
            await Promise.all([
              expressProductOrderDetailsModel
                .where({ id: shippingDetail.sub_order_detail_id })
                .increment("sent", shippingDetail.quantity),
              context.app
                .service("shipping")
                .getModel()
                .query()
                .where({
                  id: shippingDetail.shipping_id,
                  shipping_status_id: 5,
                })
                .increment(
                  "pending_payment",
                  shippingDetail.quantity *
                    expressProductOrderDetails.unit_price_tax_incl
                ),
            ]);
            //ahora buscar cuando sea una order tipo coffee y sumar hacer la misma consulta de arriba
          }

          [buyItems, sentItems] = await Promise.all([
            context.app
              .service("express-products-orders-details")
              .getModel()
              .query()
              .sum("quantity as sum")
              .where({ express_product_order_id: records.sub_order_id })
              .then((it) => parseInt(it[0].sum)),
            context.app
              .service("express-products-orders-details")
              .getModel()
              .query()
              .sum("sent as sum")
              .where({ express_product_order_id: records.sub_order_id })
              .then((it) => parseInt(it[0].sum)),
          ]);

          let Express_product_order_status_id = null;
          if (buyItems == sentItems) {
            Express_product_order_status_id = 16;
            await context.app
              .service("express-products-orders")
              .getModel()
              .query()
              .patch({ order_status_id: Express_product_order_status_id })
              .where({ id: records.sub_order_id });
          } else {
            Express_product_order_status_id = 14;
            await context.app
              .service("express-products-orders")
              .getModel()
              .query()
              .patch({ order_status_id: Express_product_order_status_id })
              .where({ id: records.sub_order_id });

            expressProductsComplete = false;
          }

          await registerExpressProductsOrdersHistory({
            express_product_order_id: records.sub_order_id,
            order_status_id: Express_product_order_status_id,
          })(context);

          break;

        case "coffee":
          const coffeeOrderDetailsModel = context.app
            .service("coffee-order-details")
            .getModel()
            .query();

          for (let index = 0; index < shippingDetails.length; index++) {
            const shippingDetail = shippingDetails[index];
            const coffeeOrderDetails = await coffeeOrderDetailsModel
              .where({ id: shippingDetail.sub_order_detail_id })
              .then((it) => it[0]);
            await Promise.all([
              coffeeOrderDetailsModel
                .where({ id: shippingDetail.sub_order_detail_id })
                .increment("sent", shippingDetail.quantity),
              context.app
                .service("shipping")
                .getModel()
                .query()
                .where({
                  id: shippingDetail.shipping_id,
                  shipping_status_id: 5,
                })
                .increment(
                  "pending_payment",
                  shippingDetail.quantity *
                    coffeeOrderDetails.total_price_tax_incl_opt_order_det_tax_inc
                ),
            ]);
          }

          [buyItems, sentItems] = await Promise.all([
            context.app
              .service("coffee-order-details")
              .getModel()
              .query()
              .sum("quantity as sum")
              .where({ coffee_order_id: records.sub_order_id })
              .then((it) => it[0].sum),
            context.app
              .service("coffee-order-details")
              .getModel()
              .query()
              .sum("sent as sum")
              .where({ coffee_order_id: records.sub_order_id })
              .then((it) => it[0].sum),
          ]);

          let coffee_order_status_id = null;
          const coffeeOrderModel = context.app
            .service("coffee-orders")
            .getModel()
            .query();

          if (buyItems == sentItems) {
            coffee_order_status_id = 28;
            await coffeeOrderModel
              .patch({ order_status_id: coffee_order_status_id })
              .where({ id: records.sub_order_id });
          } else {
            coffee_order_status_id = 27;
            await coffeeOrderModel
              .patch({ order_status_id: coffee_order_status_id })
              .where({ id: records.sub_order_id });

            coffeeComplete = false;
          }

          await registerCoffeeOrderHistory({
            coffee_order_id: records.sub_order_id,
            order_status_id: coffee_order_status_id,
          })(context);

        default:
          break;
      }

      /* aqui todas deben ser completas para que pueda cambiarse el estado de la orden principal */
      let order_status_id = null;
      const ordersModel = context.app.service("orders").getModel().query();

      if (expressProductsComplete && coffeeComplete) {
        order_status_id = 15;
        await ordersModel
          .patch({ order_status_id: order_status_id })
          .where({ id: records.order_id });
      } else {
        order_status_id = 13;
        await ordersModel
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
