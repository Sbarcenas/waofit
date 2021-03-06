// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  // Return the actual hook.
  return async (context) => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove",
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
      .then((it) => it[0]);

    if (!shoppingCart)
      throw new NotFound("No se encontró el carro de compras.");

    if (!records.payment_method)
      throw new NotAcceptable("Debes enviar el metodo de pago.");

    let userAddress = null;

    if (records.user_address_id) {
      userAddress = await context.app
        .service("users-addresses")
        .getModel()
        .query()
        .select(
          "users_addresses.*",
          "users_addresses.name AS address_name",
          "users_addresses.id AS user_address_id",
          "locations_states.name AS state_name",
          "locations_cities.name AS city_name"
        )
        .innerJoin(
          "locations_states",
          "users_addresses.state_id",
          "=",
          "locations_states.id"
        )
        .innerJoin(
          "locations_cities",
          "users_addresses.city_id",
          "=",
          "locations_cities.id"
        )
        .where({
          "users_addresses.id": records.user_address_id,
          "users_addresses.deletedAt": null,
          "users_addresses.user_id": user.id,
        })
        .then((it) => it[0]);
    } else {
      userAddress = await context.app
        .service("users-addresses")
        .getModel()
        .query()
        .select(
          "users_addresses.*",
          "users_addresses.name AS address_name",
          "users_addresses.id AS user_address_id",
          "locations_states.name AS state_name",
          "locations_cities.name AS city_name"
        )
        .innerJoin(
          "locations_states",
          "users_addresses.state_id",
          "=",
          "locations_states.id"
        )
        .innerJoin(
          "locations_cities",
          "users_addresses.city_id",
          "=",
          "locations_cities.id"
        )
        .where({
          "users_addresses.deletedAt": null,
          "users_addresses.user_id": user.id,
          "users_addresses.main": "true",
        })
        .then((it) => it[0]);
    }

    if (moment(records.shipping_date).isBefore(moment().format("YYYY-MM-DD")))
      throw new NotAcceptable(
        "La fecha que envias no es valida ya que es menor a la del dia de hoy."
      );

    if (moment(records.shipping_date).isAfter(moment().add(2, "days")))
      throw new NotAcceptable(
        "Fecha no aceptada ya que no esta en el rango de envio."
      );

    if (!userAddress) throw new NotFound("No se encontró la dirección.");

    //activar cuando se configuren los poligonos

    const shippingCost = await context.app
      .service("search-shipping-cost")
      .find({ query: { user_address_id: userAddress.id } })
      .then((it) => it.shippingCost);

    //aqui faltan hacer las consultas de los productos de restaurantes y la de cafeteria.
    const [shoppingCartDetailsExpressProduct] = await Promise.all([
      context.app
        .service("shopping-cart-details")
        .getModel()
        .query()
        .select(
          "*",
          "express_products.name AS product_name",
          "express_products.type AS product_type",
          "shopping_cart_details.id AS shopping_cart_details_id",
          "shopping_cart_details.quantity AS shopping_cart_details_quantity",
          "tax_rule.value AS tax_value",
          "tax_rule.id AS tax_id",
          "tax_rule.name AS tax_name",
          "express_products_media.source_path AS main_image"
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
        .innerJoin(
          "express_products_media",
          "express_products.id",
          "=",
          "express_products_media.product_id"
        )
        .where({
          shopping_cart_id: shoppingCart.id,
          "shopping_cart_details.deletedAt": null,
          "shopping_cart_details.shop_type": "express_product",
          "express_products.deletedAt": null,
          "express_products.status": "active",
          "express_products_media.main": "true",
          "express_products_media.media_type": "normal",
          "express_products_media.deletedAt": null,
        }),
    ]);

    //----------------------------------CALCULOS PRODUCTOS EXPRESS--------------------------------------------
    let [
      totalPriceExpressProduct,
      totalPriceExpressProductTaxExcl,
      totalTaxExpressProduct,
      priceWithOutTax,
    ] = [null, null, null];
    //for de productos express
    for (const expressProduct of shoppingCartDetailsExpressProduct) {
      priceWithOutTax = expressProduct.price * expressProduct.tax_value;
      totalPriceExpressProduct +=
        expressProduct.price * expressProduct.shopping_cart_details_quantity;
      totalPriceExpressProductTaxExcl +=
        expressProduct.price * expressProduct.shopping_cart_details_quantity -
        priceWithOutTax * expressProduct.shopping_cart_details_quantity;
      totalTaxExpressProduct +=
        priceWithOutTax * expressProduct.shopping_cart_details_quantity;
    }
    //----------------------------------FIN CALCULOS PRODUCTOS EXPRESS---------------------------------------

    //se tienen que sumar las demas variables de las demas tiendas
    records.total_price_shipping_cost_excl = totalPriceExpressProduct
      ? totalPriceExpressProduct
      : 0;
    //se tienen que sumar las demas variables del precio total sin iva
    records.total_price_tax_excl = totalPriceExpressProductTaxExcl
      ? totalPriceExpressProductTaxExcl
      : 0;
    //se tienen que sumar las demas variables del total del iva
    records.total_tax = totalTaxExpressProduct ? totalTaxExpressProduct : 0;
    records.order_status_id = 1;
    records.user_id = user.id;
    records.recurrent = "false";
    records.shopping_cart_meta_data = JSON.stringify({
      shopping_cart: shoppingCart,
      shopping_cart_details: shoppingCartDetailsExpressProduct,
    });

    context.dataOrders = {
      data: records,
      shoppingCart: shoppingCart,
      user_address: userAddress,
      date_dispatch: records.date_dispatch,
      type_dispatch: records.type_dispatch,
      shoppingCartDetailsExpressProduct,
      shippingCost: shippingCost,
      totalsShoppingCartDetailsExpressProducts: {
        total_price_tax_excl: totalPriceExpressProductTaxExcl,
        total_tax: totalTaxExpressProduct,
        total_price_tax_incl: totalPriceExpressProduct,
        total_price_shipping_cost_excl: totalPriceExpressProduct,
        total_price:
          parseFloat(shippingCost.price) +
          totalTaxExpressProduct +
          totalPriceExpressProductTaxExcl,
      },
    };

    if (shoppingCartDetailsExpressProduct.length > 0) {
      context.expressProduct = true;
      context.changeStatusShoppingCart = true;
    } else {
      context.expressProduct = false;
      context.changeStatusShoppingCart = false;
    }

    records.shipping_address_meta_data = JSON.stringify(userAddress);
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
