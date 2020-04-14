// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const { shippingDetails } = context;

    if (records.shipping_status_id == 2) {
      let expressProductsComplete = true;
      switch (records.type_sub_order) {
        case "express products":
          for (const shippingDetail of shippingDetails) {
            await context.app
              .service("express-products-orders-details")
              .getModel()
              .query()
              .where({ id: shippingDetail.sub_order_detail_id })
              .increment("sent", shippingDetail.quantity);
          }

          const [buyItems, sentItems] = await Promise.all([
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

          if (buyItems == sentItems) {
            await context.app
              .service("express-products-orders")
              .getModel()
              .query()
              .patch({ order_status_id: 16 })
              .where({ id: records.sub_order_id });
          } else {
            await context.app
              .service("express-products-orders")
              .getModel()
              .query()
              .patch({ order_status_id: 14 })
              .where({ id: records.sub_order_id });

            expressProductsComplete = false;
          }

          break;

        default:
          break;
      }

      /* aqui todas deben ser completas para que pueda cambiarse el estado de la orden principal */
      if (expressProductsComplete) {
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: 15 })
          .where({ id: records.order_id });
      } else
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: 13 })
          .where({ id: records.order_id });
    }

    replaceItems(context, records);

    return context;
  };
};
