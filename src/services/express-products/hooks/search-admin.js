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
    checkContext(context, null, ["find", "get"]);

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
        .service("express-products")
        .getModel()
        .query()
        .select("express_products.id")
        .innerJoin(
          "express_categories",
          "express_products.express_category_id",
          "=",
          "express_categories.id"
        )
        .innerJoin("brands", "express_products.brand_id", "=", "brands.id")
        .orWhere("brands.name", "LIKE", `%${value}%`)
        .orWhere("express_categories.name", "LIKE", `%${value}%`)
        .orWhere("express_products.name", "LIKE", `%${value}%`)
        .where({ "express_products.deletedAt": null })

        .then((it) => it.map((it) => it.id));

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
