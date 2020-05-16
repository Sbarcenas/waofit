// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerOrderHistory = require("../../../hooks/register-order-history");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    //aqui buscar todos los costos de envios de las subordenes
    let [shipCostExpProdDeta, shipCostCofeeShop] = [null, null];

    if (context.expressProduct)
      if (context.coffeeShop)
        shipCostExpProdDeta = await context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .select("shipping_cost")
          .where({ order_id: records.id })
          .then((it) => (it[0] ? parseFloat(it[0].shipping_cost) : 0));

    shipCostCofeeShop = await context.app
      .service("coffee-orders")
      .getModel()
      .query()
      .select("shipping_cost")
      .where({ order_id: records.id })
      .then((it) => (it[0] ? parseFloat(it[0].shipping_cost) : 0));

    //aqui sumar todos los costos y actualizar la tabla de orders

    const total_price =
      parseFloat(records.total_price_shipping_cost_excl) +
      shipCostExpProdDeta +
      shipCostCofeeShop;

    await context.app
      .service("orders")
      .getModel()
      .query()
      .patch({
        total_price: total_price,
        total_shipping_cost: shipCostExpProdDeta,
      })
      .where({ id: records.id });

    replaceItems(context, records);

    return context;
  };
};
