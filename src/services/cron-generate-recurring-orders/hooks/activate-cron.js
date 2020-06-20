// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerOrderHistory = require("../../../hooks/register-order-history");
const { query } = require("../../../utils/query-builders/batch-insert");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const rangesDate = [
      moment().format("YYYY-MM-DD"),
      moment() /* .add(1, "days") */
        .format("YYYY-MM-DD"),
    ];

    //aqui filtrar el la consulta donde last_payment_attempts sea mejor igual a 10
    //y el estado del ultimo pago no sea failed
    const recurringShoppingCarts = await context.app
      .service("recurring-shopping-cart")
      .getModel()
      .query()
      .where({
        status: "active",
        deletedAt: null,
      })
      .whereBetween("next_delivery", rangesDate)
      .whereBetween("last_payment_attempts", [0, 10]);

    for (const recurringShoppingCart of recurringShoppingCarts) {
      const dataOrder = {
        order_status_id: 1,
        shopping_cart_id: recurringShoppingCart.id,
        user_id: recurringShoppingCart.user_id,
        shopping_cart_meta_data: JSON.stringify(recurringShoppingCart),
        recurrent: "true",
        payment_method: "online",
      };

      //creamos la orden
      const order = await context.app
        .service("orders")
        .getModel()
        .query()
        .insert(dataOrder)
        .then((it) => it);

      await registerOrderHistory({
        order_id: order.id,
        order_status_id: 1,
      })(context);

      //aqui hacer el promise con los demas joins para sumar los totales y crear la orden
      const [
        recurringShoppingCartsExpressProduct,
        userCreditCard,
      ] = await Promise.all([
        context.app
          .service("recurring-shopping-cart")
          .getModel()
          .query()
          .select(
            "*",
            "express_products.name AS product_name",
            "express_products.type AS product_type",
            "recurring_shopping_cart_details.quantity AS recurring_shopping_cart_details_quantity",
            "recurring_shopping_cart_details.id AS recurring_shopping_cart_details_id",
            "recurring_shopping_cart_details.*",
            "tax_rule.name AS tax_name",
            "tax_rule.id AS tax_id",
            "tax_rule.value AS tax_value",
            "express_products_media.source_path AS main_image"
          )
          .innerJoin(
            "recurring_shopping_cart_details",
            "recurring_shopping_cart.id",
            "=",
            "recurring_shopping_cart_details.recurring_shopping_cart_id"
          )
          .innerJoin(
            "express_products",
            "recurring_shopping_cart_details.product_id",
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
            "recurring_shopping_cart.id": recurringShoppingCart.id,
            "recurring_shopping_cart.status": "active",
            "recurring_shopping_cart.deletedAt": null,
            "express_products_media.main": "true",
            "express_products_media.media_type": "normal",
            "express_products_media.deletedAt": null,
            "recurring_shopping_cart_details.shop_type": "express_product",
          })
          .then((it) => it),
        context.app
          .service("users-credit-cards")
          .getModel()
          .query()
          .where({
            user_id: recurringShoppingCart.user_id,
            deletedAt: null,
            default: "true",
          })
          .then((it) => it[0]),
      ]);

      //express products
      const userAddress = await context.app
        .service("users-addresses")
        .getModel()
        .query()
        .where({ id: recurringShoppingCart.user_address_id })
        .then((it) => it[0]);

      const shippingCost = await context.app
        .service("search-shipping-cost")
        .find({
          query: { user_address_id: recurringShoppingCart.user_address_id },
        })
        .then((it) => it.shippingCost);

      //products details
      if (recurringShoppingCartsExpressProduct.length >= 1) {
        let [
          totalPriceExpressProduct,
          totalPriceExpressProductTaxExcl,
          totalTaxExpressProduct,
        ] = [null, null, null];

        //calculamos los precios totales de la orden express
        for (const recurringShoppingCartExpressProduct of recurringShoppingCartsExpressProduct) {
          totalPriceExpressProduct +=
            recurringShoppingCartExpressProduct.price *
            recurringShoppingCartExpressProduct.recurring_shopping_cart_details_quantity;
          totalPriceExpressProductTaxExcl +=
            recurringShoppingCartExpressProduct.price *
              recurringShoppingCartExpressProduct.recurring_shopping_cart_details_quantity -
            (recurringShoppingCartExpressProduct.price -
              recurringShoppingCartExpressProduct.price /
                `1.${recurringShoppingCartExpressProduct.tax_value}`) *
              recurringShoppingCartExpressProduct.recurring_shopping_cart_details_quantity;
          totalTaxExpressProduct +=
            (recurringShoppingCartExpressProduct.price -
              recurringShoppingCartExpressProduct.price /
                `1.${recurringShoppingCartExpressProduct.tax_value}`) *
            recurringShoppingCartExpressProduct.recurring_shopping_cart_details_quantity;
        }

        //calculos express products
        const dataExpressProductsOrder = {
          user_id: recurringShoppingCart.user_id,
          order_status_id: 1,
          order_id: order.id,
          type_dispatch: "delivery",
          total_price_tax_excl: totalPriceExpressProductTaxExcl,
          total_price_tax_incl: totalPriceExpressProduct,
          total_tax: totalTaxExpressProduct,
          shipping_cost_meta_data: JSON.stringify(shippingCost),
          shipping_cost: parseFloat(shippingCost.price),
          shipping_address_meta_data: JSON.stringify(userAddress),
          date_dispatch: "0000-00-00",
          recurrent: "true",
          total_price_shipping_cost_excl: totalPriceExpressProduct,
          total_price:
            parseFloat(shippingCost.price) +
            totalPriceExpressProduct +
            totalTaxExpressProduct,
        };
        const expressProductOrder = await context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .insert({
            ...dataExpressProductsOrder,
            meta_data: JSON.stringify(dataExpressProductsOrder),
          })
          .then((it) => it);

        // console.log(expressProductOrder);

        const dataExpressProductDetails = [];
        //creamos los detalles de las sub ordenes
        for (const recurringShoppingCartExpressProduct of recurringShoppingCartsExpressProduct) {
          // console.log(recurringShoppingCartExpressProduct, "99999999999999");
          dataExpressProductDetails.push({
            express_product_order_id: expressProductOrder.id,
            express_product_id: recurringShoppingCartExpressProduct.product_id,
            type_product: recurringShoppingCartExpressProduct.product_type,
            quantity:
              recurringShoppingCartExpressProduct.recurring_shopping_cart_details_quantity,
            unit_price_tax_incl: recurringShoppingCartExpressProduct.price,
            unit_price_tax:
              recurringShoppingCartExpressProduct.price -
              recurringShoppingCartExpressProduct.price /
                `1.${recurringShoppingCartExpressProduct.tax_value}`,
            total_price_tax_incl:
              recurringShoppingCartExpressProduct.price *
              recurringShoppingCartExpressProduct.recurring_shopping_cart_details_quantity,
            total_price_tax:
              (recurringShoppingCartExpressProduct.price -
                recurringShoppingCartExpressProduct.price /
                  `1.${recurringShoppingCartExpressProduct.tax_value}`) *
              recurringShoppingCartExpressProduct.recurring_shopping_cart_details_quantity,
            sent: 0,
            express_product_name:
              recurringShoppingCartExpressProduct.product_name,
            express_product_main_image:
              recurringShoppingCartExpressProduct.main_image,
            express_product_details_meta_data: recurringShoppingCartExpressProduct,
            scheduled_delivery_date: recurringShoppingCart.next_delivery,
            createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
            updatedAt: moment().format("YYYY-MM-DD hh:mm:ss"),
          });
          //insertar los detalles mirar si se pueden guardar todos de una vez o si tiene que ser uno por uno
        }

        await query.insert(
          context.app.service("express-products-orders-details").getModel(),
          dataExpressProductDetails
        );
      }

      //aqui las demas sumatorias de las demas tiendas
      const [sumExpressProductsOrders] = await Promise.all([
        context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .select(
            "total_price_tax_excl AS total_price_tax_excl",
            "total_price_tax_incl AS total_price",
            "total_tax AS total_tax",
            "shipping_cost AS shipping_cost"
          )
          .where({ order_id: order.id })
          .then((it) => it[0]),
      ]);

      const totalSumExpressProductOrder = {
        total_price: sumExpressProductsOrders
          ? parseFloat(sumExpressProductsOrders.total_price)
          : 0,
        total_price_tax_excl: sumExpressProductsOrders
          ? parseFloat(sumExpressProductsOrders.total_price_tax_excl)
          : 0,
        total_tax: sumExpressProductsOrders
          ? parseFloat(sumExpressProductsOrders.total_tax)
          : 0,
        total_shipping_cost: sumExpressProductsOrders
          ? parseFloat(sumExpressProductsOrders.shipping_cost)
          : 0,
        total_price_shipping_cost_excl: sumExpressProductsOrders
          ? parseFloat(sumExpressProductsOrders.total_price)
          : 0,
      };

      //aqui hacer todas las sumatorias de de los totates de las demas tiendas
      const totalOrder = {
        total_price:
          totalSumExpressProductOrder.total_price +
          totalSumExpressProductOrder.total_shipping_cost,
        total_price_tax_excl: totalSumExpressProductOrder.total_price_tax_excl,
        total_tax: totalSumExpressProductOrder.total_tax,
        total_shipping_cost: totalSumExpressProductOrder.total_shipping_cost,
        total_price_shipping_cost_excl: totalSumExpressProductOrder.total_price,
      };

      recurrentOrder = await context.app
        .service("orders")
        .getModel()
        .query()
        .patch(totalOrder)
        .where({ id: order.id });

      await context.app.service("process-order-payments").create({
        dues: userCreditCard.default_payment_fees,
        user_credit_card_id: userCreditCard.id,
        order_id: order.id,
        user_id: order.user_id,
      });
    }

    replaceItems(context, records);

    return context;
  };
};
