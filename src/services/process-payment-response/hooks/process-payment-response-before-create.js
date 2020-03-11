// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerExpressProductsOrdersHistory = require("../../../hooks/register-products-orders-history");
const registerOrdenHistory = require("../../../hooks/register-order-history");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const { user } = context.params;

    replaceItems(context, records);

    return context;
  };
};
