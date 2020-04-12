// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");

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

    records.id = context.id;
    if (records.id) {
      context.id = records.id;
      // delete records.deletedAt;

      const [imageMain /* multimedia */] = await Promise.all([
        context.app
          .service("express-products-media")
          .getModel()
          .query()
          .where({
            product_id: context.id,
            main: "true",
            media_type: "normal",
            deletedAt: null,
          })
          .then((it) => it[0]),
        /*  context.app
          .service("express-products-media")
          .getModel()
          .query()
          .where({
            product_id: context.id,
            main: "false",
            deletedAt: null
          })
          .then(it => it[0]) */
      ]);

      /*  if (!imageMain)
        throw new NotAcceptable(
          "No se puede activar el producto por que no tiene una imagen principal."
        ); */

      /* if (!multimedia)
        throw new NotAcceptable(
          "No se puede activar el producto por que no tiene galeria."
        ); */

      context.params.query = {
        $eager: "[brand,category,hubs]",
      };
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
