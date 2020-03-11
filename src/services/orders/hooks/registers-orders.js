// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove"
    ]);

    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    const shoppingCart = await context.app
      .service("shopping-cart")
      .getModel()
      .query()
      .where({ user_id: user.id, deletedAt: null, status: "active" })
      .then(it => it[0]);

    let userAddress = null;

    if (records.user_address_id) {
      userAddress = await context.app
        .service("users-addresses")
        .getModel()
        .query()
        .where({
          id: records.user_address_id,
          deletedAt: null,
          user_id: user.id
        })
        .then(it => it[0]);
    } else {
      userAddress = await context.app
        .service("users-addresses")
        .getModel()
        .query()
        .where({
          deletedAt: null,
          user_id: user.id,
          main: "true"
        })
        .then(it => it[0]);
    }

    if (moment(records.shipping_date).isBefore(moment().format("YYYY-MM-DD")))
      throw new NotAcceptable(
        "La fecha que envias no es valida ya que es menor a la del dia de hoy."
      );

    if (moment(records.shipping_date).isAfter(moment().add(2, "days")))
      throw new NotAcceptable(
        "Fecha no aceptada ya que no esta en el rango de envio."
      );

    if (!shoppingCart)
      throw new NotFound("No se encontró el carro de compras.");

    if (!userAddress) throw new NotFound("No se encontró la dirección.");
    //aqui faltan hacer las consultas de los productos de restaurantes y la de cafeteria.
    const [shoppingCartDetailsExpressProduct] = await Promise.all([
      context.app
        .service("shopping-cart-details")
        .getModel()
        .query()
        .select(
          "*",
          "shopping_cart_details.id AS shopping_cart_details_id",
          "shopping_cart_details.quantity AS shopping_cart_details_quantity",
          "tax_rule.value AS tax_value"
        )
        .innerJoin(
          "express_products",
          "shopping_cart_details.product_id",
          "=",
          "express_products.id"
        )
        .innerJoin(
          "tax_rule",
          "express_products.tax_rule_id",
          "=",
          "tax_rule.id"
        )
        .where({
          shopping_cart_id: shoppingCart.id,
          "shopping_cart_details.deletedAt": null,
          "express_products.deletedAt": null,
          "express_products.status": "active"
        })
    ]);

    //----------------------------------CALCULOS PRODUCTOS EXPRESS--------------------------------------------
    let [
      totalPriceExpressProduct,
      totalPriceExpressProductTaxExcl,
      totalTaxExpressProduct
    ] = [null, null, null];
    //for de productos express
    for (const expressProduct of shoppingCartDetailsExpressProduct) {
      totalPriceExpressProduct += expressProduct.price;
      totalPriceExpressProductTaxExcl +=
        expressProduct.price -
        (expressProduct.price * expressProduct.tax_value) / 100;
      totalTaxExpressProduct +=
        (expressProduct.price * expressProduct.tax_value) / 100;
    }
    //----------------------------------FIN CALCULOS PRODUCTOS EXPRESS---------------------------------------

    //se tienen que sumar las demas variables de las demas tiendas
    records.total_price = totalPriceExpressProduct;
    //se tienen que sumar las demas variables del precio total sin iva
    records.total_price_tax_excl = totalPriceExpressProductTaxExcl;
    //se tienen que sumar las demas variables del total del iva
    records.total_tax = totalTaxExpressProduct;
    records.order_status_id = 1;
    records.user_id = user.id;

    context.dataOrders = {
      data: records,
      user_address: userAddress,
      date_dispatch: records.date_dispatch,
      type_dispatch: records.type_dispatch,
      shoppingCartDetailsExpressProduct,
      totalsShoppingCartDetailsExpressProducts: {
        total_price_tax_excl: totalPriceExpressProductTaxExcl,
        total_tax: totalTaxExpressProduct,
        total_price_tax_incl: totalPriceExpressProduct
      }
    };

    //activadores de hooks en el after y validaciones de que si tienen algo dentro,
    //si no tienen objetos dentro entonces hay que enviar un mensaje de error,
    //ya que no tendria productos el carro de compras

    //al menos un array debe estar lleno para no enviar el mensage de error
    //EJEMPLO shoppingCartDetailsExpressProduct.length > 0 o los demas arrays del promise.all
    if (shoppingCartDetailsExpressProduct.length > 0) {
      context.expressProduct = true;
      context.changeStatusShoppingCart = true;
    } else {
      throw new NotFound("No se encontrarón productos.");
    }

    delete records.user_address_id;
    delete records.date_dispatch;
    delete records.type_dispatch;
    delete records.shipping_address;
    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}