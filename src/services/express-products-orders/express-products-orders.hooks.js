const { authenticate } = require("@feathersjs/authentication").hooks;
const { fastJoin } = require("feathers-hooks-common");
const searchAdmin = require("./hooks/search-admin");
const resolves = {
  joins: {
    join: () => async (records, context) => {
      [
        records.user,
        records.order_status,
        records.order,
        records.express_products_order_details,
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
          .where({ id: records.order_status_id })
          .then((it) => it[0]),
        context.app
          .service("orders")
          .getModel()
          .query()
          .where({ id: records.order_id })
          .then((it) => it[0]),
        context.app
          .service("express-products-orders-details")
          .find({ query: { express_product_order_id: records.id } })
          .then((it) => it.data),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [searchAdmin()],
    get: [searchAdmin()],
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
