const registerExpressProduct = require("./hooks/register-express-product");
const createRecurringShoppingCardDetails = require("./hooks/create-recurrung-shopping-cart-details");
const updateRecurringShoppingCartDetails = require("./hooks/update-recurring-shopping-cart-details");
const removeSoftDelete = require("../../hooks/remove-softdelete");

const { discard, iff, isProvider } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerExpressProduct(), createRecurringShoppingCardDetails()],
    update: [],
    patch: [
      iff(
        isProvider("external"),
        discard(
          "recurring_shopping_cart_id",
          "shop_type",
          "product_id",
          "deletedAt"
        )
      ),
      updateRecurringShoppingCartDetails(),
    ],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
