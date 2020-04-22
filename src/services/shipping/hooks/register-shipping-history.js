// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerShippingHistory = require("../../../hooks/register-shipping-history");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    await registerShippingHistory({
      shipping_id: records.id,
      shipping_status_id: records.status_id,
      user_id: user.id,
    })(context);

    replaceItems(context, records);

    return context;
  };
};
