const registerShoppingCartDetails = require("./hooks/register-shopping-cart-details");
const registerExpressProduct = require("./hooks/register-express-product");
const patchExpressProduct = require("./hooks/patch-express-product");
const { discard, iff, isProvider, fastJoin } = require("feathers-hooks-common");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const restricRemove = require("./hooks/restrict-remove");
const registerCoffeeShopProduct = require("./hooks/register-coffee-shop-product");
const registerCoffeeOptionsInShoppingCardDetails = require("./hooks/register-coffee-options-in-shopping-card-details");
const registerCoffeeShopProductAfterCreate = require("./hooks/register-coffee-products-after-create");
const restrigGet = require("./hooks/restrict-get");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_options_in_scd] = await Promise.all([
        context.app
          .service("coffee-options-in-scd")
          .find({
            query: {
              shopping_cart_details_id: records.id,
            },
            paginate: false,
          })
          .then((it) => it),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [restrigGet()],
    get: [restrigGet()],
    create: [
      registerShoppingCartDetails(),
      registerExpressProduct(),
      registerCoffeeShopProduct(),
      registerCoffeeOptionsInShoppingCardDetails(),
    ],
    update: [],
    patch: [
      iff(
        isProvider("external"),
        discard("shopping_cart_id", "shop_type", "product_id", "deletedAt")
      ),
      patchExpressProduct(),
    ],
    remove: [restricRemove(), removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
    create: [registerCoffeeShopProductAfterCreate()],
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
