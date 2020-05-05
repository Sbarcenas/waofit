// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  // Return the actual hook.
  return async (context) => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove",
    ]);

    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    if (context.params.query.data_value && user.role == "admin") {
      const value = context.params.query.data_value;
      delete context.params.query.data_value;

      const ordersIds = await context.app
        .service("express-products-orders")
        .getModel()
        .query()
        .select("express_products_orders.id")
        .innerJoin("users", "users.id", "=", "express_products_orders.user_id")
        .innerJoin(
          "orders_status",
          "orders_status.id",
          "=",
          "express_products_orders.order_status_id"
        )
        .orWhere("users.last_name", "LIKE", `%${value}%`)
        .orWhere("users.first_name", "LIKE", `%${value}%`)
        .orWhere("users.email", "LIKE", `%${value}%`)
        .orWhere("users.phone", "LIKE", `%${value}%`)
        .orWhere("express_products_orders.total_price", "LIKE", `%${value}%`)
        .orWhere("express_products_orders.shipping_cost", "LIKE", `%${value}%`)
        .orWhere("express_products_orders.date_dispatch", "LIKE", `%${value}%`)
        .orWhere("express_products_orders.order_id", "LIKE", `%${value}%`)

        .then((it) => it.map((it) => it.id));

      console.log(ordersIds);

      context.params.query = { id: { $in: ordersIds } };
    }

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
