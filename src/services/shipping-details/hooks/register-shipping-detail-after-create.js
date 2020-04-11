// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    /* switch (records.type_sub_order) {
      case "express products":
        subOrderDetail = await context.app
          .service("express-products-orders-details")
          .getModel()
          .query()
          .where({
            id: records.sub_order_detail_id,
            express_product_order_id: records.sub_order_id,
          })
          .increment("sent", records.quantity)
          .then((it) => it[0]);

        break;

      default:
        break;
    }
 */
    replaceItems(context, records);

    return context;
  };
};
