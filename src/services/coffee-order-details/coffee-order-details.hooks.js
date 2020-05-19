const { fastJoin, iff, isProvider } = require("feathers-hooks-common");
const restrictGetCoffeeOrderDetails = require("./hooks/restrict-get-coffee-order-details");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_opt_order_det] = await Promise.all([
        context.app.service("coffee-opt-order-det").find({
          query: { coffee_order_details_id: records.id, deletedAt: null },
          paginate: false,
        }),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [
      /* iff(isProvider("external"), restrictGetCoffeeOrderDetails() )*/
    ],
    get: [
      /* iff(isProvider("external"), restrictGetCoffeeOrderDetails() )*/
    ],
    create: [],
    update: [],
    patch: [],
    remove: [],
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
