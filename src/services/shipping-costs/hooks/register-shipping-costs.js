// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const inside = require("point-in-polygon");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    records.polygon = JSON.stringify(records.polygon);

    replaceItems(context, records);

    return context;
  };
};
