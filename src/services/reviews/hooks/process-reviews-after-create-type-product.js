// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const { user } = context.params;

    if (context.typeReview == "express-product") {
      await context.app.service("express-products").patch(records.type_id, {});
    }

    replaceItems(context, records);

    return context;
  };
};
