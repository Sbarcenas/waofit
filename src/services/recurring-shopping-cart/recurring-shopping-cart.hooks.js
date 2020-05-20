const createRecurringShoppingCart = require("./hooks/create-recurring-shopping-cart");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const activateRecurrindShoppingCart = require("./hooks/activate-recurring-shopping-cart");
const searchAdmin = require("./hooks/search-admin");

const { fastJoin } = require("feathers-hooks-common");
const resolves = {
  joins: {
    join: () => async (records, context) => {
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
      [records.user] = await Promise.all([
        context.app
          .service("users")
          .getModel()
          .query()
          .select("first_name", "last_name", "email", "phone", "gender")
          .where({ id: records.user_id })
          .then((it) => it[0]),
      ]);

      records.recurring_shopping_cart_details = await context.app
        .service("recurring-shopping-cart-details")
        .find({
          query: { recurring_shopping_cart_id: records.id, deletedAt: null },
          paginate: false,
        });
    },
  },
};
module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [createRecurringShoppingCart()],
    update: [],
    patch: [activateRecurrindShoppingCart()],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
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
