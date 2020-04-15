// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const algolia = require("../../../utils/algolia");

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
    2;
    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    const algoliaCredemtials = context.app.get("algolia");

    const Algolia = new algolia(
      "recipes",
      algoliaCredemtials.appId,
      algoliaCredemtials.apiKey
    );

    if (records.status == "active") {
      records.objectID = parseInt(records.id);
      records.ingredients ? delete records.ingredients : null;
      records.shared_number ? delete records.shared_number : null;
      records.amount_of_people ? delete records.amount_of_people : null;
      records.nutrition_description
        ? delete records.nutrition_description
        : null;
      records.preparation_description
        ? delete records.preparation_description
        : null;
      records.createdAtUnix = Math.floor(records.createdAt / 1000);
      Algolia.save(records);
    } else if (records.status == "inactive") {
      Algolia.remove(records.id);
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
