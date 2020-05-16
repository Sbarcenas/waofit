// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const { query } = require("../../../utils/query-builders/batch-insert");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;
    // const dateDelivery = await context.app
    //   .service("calculate-next-delivery")
    //   .find()
    //   .then((it) => moment(it.dateDelivery).format("YYYY-MM-DD"));

    let [
      totalPriceCoffeeShop,
      totalPriceCoffeeShopTaxExcl,
      totalTaxCoffeeShop,
    ] = [null, null, null];
    let [
      totalPriceCoffeeShopAttributesTaxInc,
      totalPriceCoffeeShopAttributesTaxExc,
      totalTaxCoffeeShopAttributes,
      shoppingCartDetailsCoffeeAttributes,
    ] = [null, null, null, []];

    if (context.coffeeShop) {
      const { shoppingCartDetailsCoffeeShop } = context.dataOrders;

      for (
        let index = 0;
        index < shoppingCartDetailsCoffeeShop.length;
        index++
      ) {
        const shoppingCartDetailCoffeeShop =
          shoppingCartDetailsCoffeeShop[index];

        const coffeeOrderDetailsData = {
          coffee_order_id: context.dataOrders.coffeeOrderId,
          coffee_shop_product_id: shoppingCartDetailCoffeeShop.product_id,
          unit_price_tax_excl:
            shoppingCartDetailCoffeeShop.price /
            `1.${shoppingCartDetailCoffeeShop.tax_value}`,
          quantity: shoppingCartDetailCoffeeShop.shopping_cart_details_quantity,
          unit_price_tax_incl: shoppingCartDetailCoffeeShop.price,
          unit_price_tax:
            shoppingCartDetailCoffeeShop.price -
            shoppingCartDetailCoffeeShop.price /
              `1.${shoppingCartDetailCoffeeShop.tax_value}`,
          total_price_tax_incl:
            shoppingCartDetailCoffeeShop.price *
            shoppingCartDetailCoffeeShop.shopping_cart_details_quantity,
          total_price_tax:
            (shoppingCartDetailCoffeeShop.price -
              shoppingCartDetailCoffeeShop.price /
                `1.${shoppingCartDetailCoffeeShop.tax_value}`) *
            shoppingCartDetailCoffeeShop.shopping_cart_details_quantity,
          sent: 0,
          shipping_status: "pending shipping",
          coffee_shop_product_name: shoppingCartDetailCoffeeShop.product_name,
          coffee_shop_product_image: shoppingCartDetailCoffeeShop.image_path,
          coffee_shop_product_details_meta_data: JSON.stringify(
            shoppingCartDetailCoffeeShop
          ),
          createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
          updatedAt: moment().format("YYYY-MM-DD hh:mm:ss"),
        };

        const coffeeOrderDetails = await context.app
          .service("coffee-order-details")
          .getModel()
          .query()
          .insert(coffeeOrderDetailsData);

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

          const coffeeOptCoffeeOrderDet = [];
          for (const coffeeOption of coffeeOptionsJoinAttiOfSections) {
            // console.log(`1.${coffeeShop.tax_value}`, "-------------------");

            coffeeOptCoffeeOrderDet.push({
              coffee_order_details_id: coffeeOrderDetails.id,
              coffee_attributes_of_section_id:
                coffeeOption.coffee_attributes_of_section_id,
              total_price_tax_inc:
                coffeeOption.price *
                coffeeShop.shopping_cart_details_quantity *
                `1.${coffeeOption.tax_value}`,
              total_price_tax_excl:
                coffeeOption.price * coffeeShop.shopping_cart_details_quantity,
              total_price:
                coffeeOption.price *
                coffeeShop.shopping_cart_details_quantity *
                `1.${coffeeOption.tax_value}`,
              unit_price_tax_excl: coffeeOption.price,
              unit_price_tax_inc:
                coffeeOption.price * `1.${coffeeOption.tax_value}`,
              total_tax:
                coffeeOption.price *
                  `1.${coffeeOption.tax_value}` *
                  coffeeShop.shopping_cart_details_quantity -
                coffeeOption.price,
              createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
              updatedAt: moment().format("YYYY-MM-DD hh:mm:ss"),
            });

            //aqui insertar uno por uno para tomar el id de la suborden y sumarle el valor de los productos.
          }
          console.log(coffeeOptCoffeeOrderDet);

          await query.insert(
            context.app.service("coffee-opt-order-det").getModel(),
            coffeeOptCoffeeOrderDet
          );
        }
        //calculos los atributos
      }
    }

    replaceItems(context, records);

    return context;
  };
};
