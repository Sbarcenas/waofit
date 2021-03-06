const registerShoppingCart = require("./hooks/register-shopping-cart");
const registerExpressProduct = require("./hooks/register-express-product");
const registerExpressProductAfterCreate = require("./hooks/register-express-products-after-create");
const registerShoppingCartEmpty = require("./hooks/register-shopping-cart-empty");
// const productsJoins = require("./hooks/express-products-join");
const {
  disallow,
  paramsFromClient,
  fastJoin,
} = require("feathers-hooks-common");

const switchRegisterShoppingCartBefore = [
  paramsFromClient("shopping_cart_empty"),
  async (context) => {
    if (
      context.params.shopping_cart_empty == "true" ||
      context.params.shopping_cart_empty == true
    ) {
      return registerShoppingCartEmpty()(context);
    } else {
      return (
        await registerShoppingCart()(context),
        await registerExpressProduct()(context)
      );
    }
  },
];

const switchRegisterShoppingCartAfter = [
  paramsFromClient("shopping_cart_empty"),
  async (context) => {
    if (
      context.params.shopping_cart_empty == "true" ||
      context.params.shopping_cart_empty == true
    ) {
      return context;
    } else {
      console.log("en el after");
      return registerExpressProductAfterCreate()(context);
    }
  },
];

const productsJoins = {
  joins: {
    role: () => async (records, context) => {
      records.shipment_of_scheduled_products = await context.app
        .service("calculate-next-delivery")
        .find();
      const userAdress = await context.app
        .service("users-addresses")
        .getModel()
        .query()
        .where({ user_id: context.params.user.id, main: "true" })
        .then((it) => it[0]);
      let msj = null;
      if (userAdress) {
        msj = await context.app
          .service("search-shipping-cost")
          .find({ query: { user_address_id: userAdress.id } })
          .then((it) => it.shippingCost);
      }
      records.shipping_cost = msj ? msj : false;
      if (context.params.products) {
        const shopping_cart_details = records.shopping_cart_details;
        for (let index = 0; index < shopping_cart_details.length; index++) {
          if (shopping_cart_details[index].shop_type == "express_product") {
            records.shopping_cart_details[index].product = await context.app
              .service("express-products")
              .getModel()
              .query()
              .select(
                "express_products.id",
                "express_products.name",
                "express_products.price",
                "express_products.regular_price",
                "express_products.shop_type",
                "express_products.status",
                "express_products.type AS type",
                "express_products.regular_price",
                "express_products_media.type AS type_media",
                "express_products_media.source_path AS main_image",
                "express_products_media.video_cover_path",
                "express_products_media.id AS express_products_media_id"
              )
              .innerJoin(
                "express_products_media",
                "express_products.id",
                "=",
                "express_products_media.product_id"
              )
              .where({
                "express_products.id":
                  records.shopping_cart_details[index].product_id,
                "express_products.deletedAt": null,
                "express_products_media.main": "true",
                "express_products_media.media_type": "normal",
                /* "express_products_media.type": "image", */
                "express_products_media.deletedAt": null,
              })
              .then((it) => it[0]);
          } else if (shopping_cart_details[index].shop_type == "coffee") {
            records.shopping_cart_details[index].product = await context.app
              .service("coffee-shop-products")
              .getModel()
              .query()
              .where({
                "coffee_shop_products.id":
                  records.shopping_cart_details[index].product_id,
              })
              .then((it) => it[0]);

            const coffeeOpionsIds = await context.app
              .service("coffee-options-in-scd")
              .getModel()
              .query()
              .where({
                shopping_cart_details_id:
                  records.shopping_cart_details[index].id,
                deletedAt: null,
              })
              .map((it) => it.coffee_options_id);

            console.log(coffeeOpionsIds, "---------");

            const coffeeOptions = await context.app
              .service("coffee-options")
              .getModel()
              .query()
              .select("coffee_options.*", "tax_rule.value AS tax_value")
              .innerJoin(
                "tax_rule",
                "tax_rule.id",
                "=",
                "coffee_options.tax_rule_id"
              )
              .whereIn("coffee_options.id", coffeeOpionsIds);

            let [priceWithOutTax, totalPrice] = [null, null];
            for (const coffeeOption of coffeeOptions) {
              priceWithOutTax =
                coffeeOption.price / (1 + coffeeOption.tax_value);
              totalPrice +=
                coffeeOption.price - (coffeeOption.price - priceWithOutTax);
            }
            records.shopping_cart_details[index].product.price += totalPrice;
          }
        }
      }
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [paramsFromClient("products")],
    get: [paramsFromClient("products")],
    create: [...switchRegisterShoppingCartBefore],
    update: [disallow("external")],
    patch: [disallow("external")],
    remove: [disallow("external")],
  },

  after: {
    all: [],
    find: [fastJoin(productsJoins)],
    get: [fastJoin(productsJoins)],
    create: [...switchRegisterShoppingCartAfter],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
