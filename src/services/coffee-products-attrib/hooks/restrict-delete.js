// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  // Return the actual hook.
  return async (context) => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, ["remove"]);

    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    const attribute = await context.app
      .service("coffee-products-attrib")
      .getModel()
      .query()
      .where({ id: context.id, deletedAt: null })
      .then((it) => it[0]);

    const coffeeProducts = await context.app
      .service("coffee-shop-products")
      .getModel()
      .query()
      .where({ id: attribute.coffee_options_template_id, deletedAt: null })
      .then((it) => it[0]);

    if (coffeeProducts)
      throw new NotAcceptable(
        "No se puede eliminar por que esta asociado a un producto"
      );

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
