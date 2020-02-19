// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
const batchUpdateExpressProductsAlgolia = require("../../../hooks/batch-update-express-products-algolia");
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

    if (context.updateAlgolia) {
      const productsIds = await context.app
        .service("express-products-hubs")
        .getModel()
        .query()
        .where({ hub_id: records.id })
        .then(it => it.map(it => it.product_id));

      const products = await context.app
        .service("express-products")
        .find({
          query: {
            $eager: "[brand,category,hubs]",
            id: {
              $in: productsIds
            },
            deletedAt: null
          }
        })
        .then(it => it.data);

      await batchUpdateExpressProductsAlgolia(
        products,
        "expressProducts"
      )(context);
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
