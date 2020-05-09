const registerShoppingCartDetails = require("./hooks/register-shopping-cart-details");
const registerExpressProduct = require("./hooks/register-express-product");
const patchExpressProduct = require("./hooks/patch-express-product");
const { discard, iff, isProvider } = require("feathers-hooks-common");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const restricRemove = require("./hooks/restrict-remove");
const registerCoffeeShopProduct = require("./hooks/register-coffee-shop-product");
const registerCoffeeOptionsInShoppingCardDetails = require("./hooks/register-coffee-options-in-shopping-card-details");
const registerCoffeeShopProductAfterCreate = require("./hooks/register-coffee-products-after-create");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
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
    find: [],
    get: [],
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
