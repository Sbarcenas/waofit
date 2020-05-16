// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerCoffeeOrderHistory = require("../../../hooks/register-coffee-order-history");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;
    const { shippingCost } = context.dataOrders;

    if (context.coffeeShop) {
      const data = {
        user_id: user.id,
        order_status_id: 21,
        order_id: records.id,
        type_dispatch: context.dataOrders.type_dispatch,
        shipping_address_meta_data: JSON.stringify(
          context.dataOrders.user_address
        ),
        total_price_tax_excl:
          context.dataOrders.totalsShoppingCartDetailsCoffee
            .total_price_tax_excl,
        total_price_tax_incl:
          context.dataOrders.totalsShoppingCartDetailsCoffee
            .total_price_tax_incl,
        total_tax: context.dataOrders.totalsShoppingCartDetailsCoffee.total_tax,
        shipping_cost_meta_data: shippingCost
          ? JSON.stringify(shippingCost)
          : "",
        shipping_cost: shippingCost ? parseFloat(shippingCost.price) : 0.0,
        total_price_shipping_cost_excl:
          context.dataOrders.totalsShoppingCartDetailsCoffee
            .total_price_shipping_cost_excl,
        total_price:
          context.dataOrders.totalsShoppingCartDetailsCoffee.total_price,
      };

      context.dataOrders.coffeeOrderId = await context.app
        .service("coffee-orders")
        .getModel()
        .query()
        .insert({ ...data, meta_data: JSON.stringify(data) })
        .then((it) => it.id);

      await registerCoffeeOrderHistory({
        coffee_order_id: context.dataOrders.coffeeOrderId,
        order_status_id: 21,
      })(context);
    }

    replaceItems(context, records);

    return context;
  };
};
