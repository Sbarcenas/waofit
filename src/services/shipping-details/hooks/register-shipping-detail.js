// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    let subOrderDetail,
      shipping,
      subOrder = null;

    if (records.quantity <= 0)
      throw new NotAcceptable("Debes enviar una cantidad valida.");

    switch (records.type_sub_order) {
      case "express products":
        subOrderDetail = await context.app
          .service("express-products-orders-details")
          .getModel()
          .query()
          .where({
            id: records.sub_order_detail_id,
            express_product_order_id: records.sub_order_id,
          })
          .then((it) => it[0]);

        subOrder = await context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .where({
            id: records.sub_order_id,
          })
          .whereIn("order_status_id", [10, 14])
          .then((it) => it[0]);

        if (!subOrder) throw new NotFound("No se encontró la orden.");

        shipping = await context.app
          .service("shipping")
          .getModel()
          .query()
          .where({
            id: records.shipping_id,
            type_sub_order: "express products",
            order_id: subOrder.order_id,
            shipping_status_id: 1,
          })
          .then((it) => it[0]);

        break;

      default:
        break;
    }

    if (!subOrderDetail)
      throw new NotFound("No se encontró el detalle de la orden.");
    if (!shipping) throw new NotFound("No se encontró el shipping.");

    const sumDetailsInPreparation = await context.app
      .service("shipping-details")
      .getModel()
      .query()
      .sum("quantity as sum")
      .where({
        type_sub_order: records.type_sub_order,
        sub_order_detail_id: records.sub_order_detail_id,
      })
      .then((it) => parseInt(it[0].sum));

    if (subOrderDetail.quantity < records.quantity + subOrderDetail.sent)
      throw new NotAcceptable(
        "No se puede ingresar cantidad por que supera la cantidad comprada."
      );

    if (sumDetailsInPreparation + records.quantity > subOrderDetail.quantity)
      throw new NotAcceptable(
        "Cantidad enviada con error ya que en prepacion se encuentra una cantidad y mas esta cantidad superan la cantidad por enviar."
      );

    replaceItems(context, records);

    return context;
  };
};
