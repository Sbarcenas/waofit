// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const { query } = require("../../../utils/query-builders/batch-insert");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (context.expressProduct) {
      const products = context.dataOrders.shoppingCartDetailsExpressProduct;

      const data = [];
      for (const product of products) {
        console.log(product);

        data.push({
          express_product_order_id: context.dataOrders.expressProductOrderId,
          express_product_id: product.product_id,
          type_product: product.type,
          unit_price_tax_excl: product.price / `1.${product.tax_value}`,
          quantity: product.shopping_cart_details_quantity,
          unit_price_tax_incl: product.price,
          unit_price_tax:
            product.price - product.price / `1.${product.tax_value}`,
          total_price_tax_incl:
            product.price * product.shopping_cart_details_quantity,
          total_price_tax:
            (product.price - product.price / `1.${product.tax_value}`) *
            product.shopping_cart_details_quantity,
          sent: 0,
        });
      }

      await query.insert(
        context.app.service("express-products-orders-details").getModel(),
        data
      );
    }

    replaceItems(context, records);

    return context;
  };
};
