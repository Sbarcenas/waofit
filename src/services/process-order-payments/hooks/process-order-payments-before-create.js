// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove"
    ]);

    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    if (records.dues > 36 || records.dues < 1)
      throw new NotAcceptable(
        "El numero de coutas no debe ser mayor a 36 y menor a 1."
      );

    const [order, creditCard] = await Promise.all([
      context.app
        .service("orders")
        .getModel()
        .query()
        .where({
          user_id: user.id,
          order_status_id: 1,
          deletedAt: null,
          id: records.order_id
        })
        .then(it => it[0]),
      context.app
        .service("users-credit-cards")
        .getModel()
        .query()
        .where({
          user_id: user.id,
          id: records.user_credit_card_id,
          deletedAt: null
        })
        .then(it => it[0])
    ]);

    if (!order) throw new NotFound("No se encontró la orden.");
    if (!creditCard)
      throw new NotFound("No se encontró la tarjeta de credito.");

    context.dataPayment = {
      creditCard: creditCard,
      order: order,
      dues: records.dues
    };

    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}
