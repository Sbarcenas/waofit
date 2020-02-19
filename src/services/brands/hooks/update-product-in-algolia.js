// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
const batchUpdateExpressProductsAlgolia = require("../../../hooks/batch-update-express-products-algolia");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const products = await context.app
      .service("express-products")
      .find({ query: { $eager: "[brand,category,hubs]", deletedAt: null } })
      .then(it => it.data);

    await batchUpdateExpressProductsAlgolia(
      products,
      "expressProducts"
    )(context);

    replaceItems(context, records);

    return context;
  };
};
