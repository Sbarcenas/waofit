const createRecurringShoppingCart = require("./hooks/create-recurring-shopping-cart");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const activateRecurrindShoppingCart = require("./hooks/activate-recurring-shopping-cart");
const searchAdmin = require("./hooks/search-admin");

const { fastJoin, isProvider, iff } = require("feathers-hooks-common");
const { runInContext } = require("lodash");
const moment = require("moment");

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

      if (records.status != "active") {
        let frequency = {};
        let quantity = 0;
        if (records.frequency == "7 days") {
          frequency = "days";
          quantity = 7;
        } else if (records.frequency == "15 days") {
          frequency = "days";
          quantity = 15;
        } else {
          frequency = "months";
          quantity = 1;
        }

        records.next_delivery = await context.app
          .service("calculate-next-delivery")
          .find({ query: { frequency, quantity } })
          .then((it) => moment(it.next_delivery).format("YYYY-MM-DD"));
      }
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
    find: [iff(isProvider("external"), fastJoin(resolves))],
    get: [iff(isProvider("external"), fastJoin(resolves))],
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
