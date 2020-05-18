// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const lodash = require("lodash");
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

    const { shoppingCart, shippingCost } = context.dataOrders;
    const shoppingCartDetailsCoffeeShop = await context.app
      .service("shopping-cart-details")
      .getModel()
      .query()
      .select(
        "*",
        "coffee_shop_products.name AS product_name",
        // "coffee_shop_products.type AS product_type",
        "shopping_cart_details.id AS shopping_cart_details_id",
        "shopping_cart_details.quantity AS shopping_cart_details_quantity",
        "tax_rule.value AS tax_value",
        "tax_rule.id AS tax_id",
        "tax_rule.name AS tax_name"
        // "express_products_media.source_path AS main_image"
      )
      .innerJoin(
        "coffee_shop_products",
        "shopping_cart_details.product_id",
        "=",
        "coffee_shop_products.id"
      )
      .innerJoin(
        "tax_rule",
        "coffee_shop_products.tax_rule_id",
        "=",
        "tax_rule.id"
      )
      .where({
        shopping_cart_id: shoppingCart.id,
        "shopping_cart_details.deletedAt": null,
        "coffee_shop_products.deletedAt": null,
        "coffee_shop_products.status": "active",
        "shopping_cart_details.shop_type": "coffee",
      });

    //----------------------------------CALCULOS CAFETERIA--------------------------------------------
    let [
      totalPriceCoffeeShop,
      totalPriceCoffeeShopTaxExcl,
      totalTaxCoffeeShop,
    ] = [null, null, null];
    //for de cafeteria
    let [
      totalPriceCoffeeShopAttributesTaxInc,
      totalPriceCoffeeShopAttributesTaxExc,
      totalTaxCoffeeShopAttributes,
      shoppingCartDetailsCoffeeAttributes,
    ] = [null, null, null, []];
    for (const coffeeShop of shoppingCartDetailsCoffeeShop) {
      const coffeeOptionsIds = await context.app
        .service("coffee-options-in-scd")
        .getModel()
        .query()
        .where({
          shopping_cart_details_id: coffeeShop.shopping_cart_details_id,
          deletedAt: null,
        })
        .then((it) => it.map((it) => it.coffee_options_id));

      const coffeeOptionsJoinAttiOfSections = await context.app
        .service("coffee-options")
        .getModel()
        .query()
        .select(
          "*",
          "coffee_options.id AS coffee_option_id",
          "coffee_options.id AS coffee_option_id",
          "coffee_attributes_of_section.tax_rule_id",
          "tax_rule.value AS tax_value"
        )
        .innerJoin(
          "coffee_attributes_of_section",
          "coffee_options.coffee_attributes_of_section_id",
          "=",
          "coffee_attributes_of_section.id"
        )
        .innerJoin(
          "tax_rule",
          "coffee_attributes_of_section.tax_rule_id",
          "=",
          "tax_rule.id"
        )
        .whereIn("coffee_options.id", coffeeOptionsIds)
        .then((it) => it);

      // console.log(coffeeShop);
      for (const coffeeOption of coffeeOptionsJoinAttiOfSections) {
        totalPriceCoffeeShopAttributesTaxExc +=
          coffeeOption.price * coffeeShop.shopping_cart_details_quantity;
        totalPriceCoffeeShopAttributesTaxInc +=
          coffeeOption.price *
          coffeeShop.shopping_cart_details_quantity *
          `1.${coffeeOption.tax_value}`;
        totalTaxCoffeeShopAttributes +=
          coffeeOption.price *
            coffeeShop.shopping_cart_details_quantity *
            `1.${coffeeOption.tax_value}` -
          coffeeOption.price * coffeeShop.shopping_cart_details_quantity;
      }

      totalPriceCoffeeShop +=
        coffeeShop.price * coffeeShop.shopping_cart_details_quantity +
        totalPriceCoffeeShopAttributesTaxInc;
      totalPriceCoffeeShopTaxExcl +=
        coffeeShop.price * coffeeShop.shopping_cart_details_quantity -
        (coffeeShop.price - coffeeShop.price / `1.${coffeeShop.tax_value}`) *
          coffeeShop.shopping_cart_details_quantity;
      totalTaxCoffeeShop +=
        (coffeeShop.price - coffeeShop.price / `1.${coffeeShop.tax_value}`) *
        coffeeShop.shopping_cart_details_quantity;
    }

    //----------------------------------FIN CALCULOS CAFETERIA---------------------------------------

    //SE SUMAN LOS TOTALES DE LA CAFETERIA

    records.total_price_shipping_cost_excl += totalPriceCoffeeShop
      ? totalPriceCoffeeShop
      : 0;

    let total_price_tax_excl = null;
    total_price_tax_excl +=
      (totalPriceCoffeeShopAttributesTaxExc
        ? totalPriceCoffeeShopAttributesTaxExc
        : 0) + (totalPriceCoffeeShopTaxExcl ? totalPriceCoffeeShopTaxExcl : 0);

    records.total_price_tax_excl += total_price_tax_excl;

    records.total_tax +=
      (totalTaxCoffeeShop ? totalTaxCoffeeShop : 0) +
      (totalTaxCoffeeShopAttributes ? totalTaxCoffeeShopAttributes : 0);

    if (shoppingCartDetailsCoffeeShop.length > 0) {
      context.coffeeShop = true;
      context.changeStatusShoppingCart = true;
      context.dataOrders = {
        ...context.dataOrders,
        shoppingCartDetailsCoffeeShop,
        totalsShoppingCartDetailsCoffee: {
          total_price_tax_excl: totalPriceCoffeeShopTaxExcl,
          total_tax: records.total_tax,
          total_price_tax_incl: totalPriceCoffeeShop,
          total_price_shipping_cost_excl: totalPriceCoffeeShop,
          total_price:
            totalPriceCoffeeShop +
            parseFloat(
              shippingCost.price
            ) /* +
            totalTaxCoffeeShop, */,
          totalCoffeeOptions: {
            totalPriceCoffeeShopAttributesTaxExc,
            totalPriceCoffeeShopAttributesTaxInc,
            totalTaxCoffeeShopAttributes,
          },
        },
      };
    } else {
      context.coffeeShop = false;
      context.changeStatusShoppingCart = false;
    }

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
