// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");

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
    let records = getItems(context);

    if (context.params.query.parent_id) return context;

    const elements = {};
    const data = records.map(({ id, name, parent_id, path_image }) => ({
      id: id,
      name,
      parent_id,
      path_image,
      childrens: []
    }));

    data.forEach((element, index) => {
      elements[element.id] = index;
    });

    for (let index = data.length - 1; index >= 0; index--) {
      const parent_id = data[index].parent_id;
      if (data[index].parent_id) {
        const el = data.splice(index, 1);
        data[elements[parent_id]].childrens.push(el[0]);
      }
    }

    records = data;
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
