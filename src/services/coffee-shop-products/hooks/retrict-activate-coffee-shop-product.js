// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");

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

    if (records.status == "active") {
      const [cofeeProduct] = await Promise.all([
        context.app
          .service("coffee-shop-products")
          .getModel()
          .query()
          .where({
            id: context.id,
            deletedAt: null,
          })
          .then((it) => it[0]),
      ]);

      if (!cofeeProduct.image_path)
        throw new NotAcceptable(
          "No se puede activar el producto por que no tiene una imagen."
        );

      if (!cofeeProduct.coffee_options_template_id)
        throw new NotAcceptable(
          "No se puede activar el producto ya que no tiene un template de caracteristicas relacionado."
        );

      const coffeeShopProductAttributesIds = await context.app
        .service("coffee-products-attrib")
        .getModel()
        .query()
        .select("id")
        .where({
          coffee_options_template_id: cofeeProduct.coffee_options_template_id,
        })
        .then((it) => it.map((it) => it.id));

      if (coffeeShopProductAttributesIds.length < 1) {
        throw new NotAcceptable(
          "No se puede activar el producto por que la plantilla que tiene asignada no tiene attributos."
        );
      }

      const coffeeShopProductAttributesOfSection = await context.app
        .service("coffee-attributes-of-section")
        .getModel()
        .query()
        .select("coffee_products_attrib_id")
        .whereIn("coffee_products_attrib_id", coffeeShopProductAttributesIds)
        .where({ deletedAt: null })
        .then((it) => it);

      if (coffeeShopProductAttributesOfSection.length < 1)
        throw new NotAcceptable("No se encontraron atributos relacionados");
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
