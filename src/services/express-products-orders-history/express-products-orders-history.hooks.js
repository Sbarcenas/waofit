const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [
        records.user,
        records.order_status,
        records.express_product_order,
      ] = await Promise.all([
        context.app
          .service("users")
          .getModel()
          .query()
          .select("first_name", "last_name", "email", "phone", "gender")
          .where({ id: records.user_id })
          .then((it) => it[0]),
        context.app
          .service("orders-status")
          .getModel()
          .query()
          .where({ id: records.order_status_id }),
        context.app
          .service("express-products-orders")
          .getModel()
          .query()
          .where({ id: records.express_product_order_id })
          .then((it) => it[0]),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
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
