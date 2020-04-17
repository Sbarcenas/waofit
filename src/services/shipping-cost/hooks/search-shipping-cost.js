// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerOrderHistory = require("../../../hooks/register-order-history");
const registerExpressProductsOrdersHistory = require("../../../hooks/register-products-orders-history");
// const inside = require("point-in-polygon");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    // var polygon = [
    //   [1, 1],
    //   [1, 2],
    //   [2, 2],
    //   [2, 1],
    // ];

    // console.dir([
    //   inside([1.5, 1.5], polygon),
    //   inside([4.9, 1.2], polygon),
    //   inside([1.8, 1.1], polygon),
    // ]);

    replaceItems(context, records);

    return context;
  };
};
