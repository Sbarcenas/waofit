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
      .service("coffee-shop-attributes")
      .getModel()
      .query()
      .where({ id: context.id })
      .then((it) => it[0]);

    if (!attribute) throw new NotFound("Atributo no encontrado.");

    const coffeeProductsAttribIds = await context.app
      .service("coffee-attributes-of-section")
      .getModel()
      .query()
      .where({ coffee_shop_attributes_id: attribute.id, deletedAt: null })
      .then((it) => it.map((it) => it.coffee_products_attrib_id));

    if (coffeeProductsAttribIds.length > 0) {
      const templatesIds = await Promise.all([
        context.app
          .service("coffee-products-attrib")
          .getModel()
          .query()
          .whereIn("id", coffeeProductsAttribIds)
          .where({ deletedAt: null })
          .then((it) => it.map((it) => it.coffee_options_template_id)),
      ]);

      const coffeeProducts = await context.app
        .service("coffee-shop-products")
        .getModel()
        .query()
        .whereIn("id", templatesIds)
        .where({ deletedAt: null })
        .then((it) => it[0]);

      if (coffeeProducts)
        throw new NotAcceptable(
          "No se puede eliminar por que esta asociado a un producto"
        );
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
