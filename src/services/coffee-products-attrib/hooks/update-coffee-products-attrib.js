// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;
    let records = getItems(context);

    if (records.field_type && records.field_type == "multiple_selection") {
      if (records.min_selects > records.max_selects)
        throw new NotAcceptable(
          "La minima cantidad no puede ser mayor a la cantidad máxima."
        );
    } else {
      records.min_selects = 1;
      records.max_selects = 1;
    }

    replaceItems(context, records);

    return context;
  };
};
