// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const lodash = require("lodash");
const updateExpressProductsAlgolia = require("../../../hooks/update-express-products-algolia");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    /* records = lodash.flattenDeep(records)[0]; */

    await updateExpressProductsAlgolia(records.product_id)(context);

    replaceItems(context, records);

    return context;
  };
};
