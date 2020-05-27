const { disallow, fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.order_status, records.users] = await Promise.all([
        context.app
          .service("orders-status")
          .getModel()
          .query()
          .where({ id: records.order_status_id, deletedAt: null })
          .then((it) => it[0]),
        context.app
          .service("users")
          .getModel()
          .query()
          .select("id", "first_name", "last_name", "email", "phone")
          .where({ id: records.user_id, deletedAt: null })
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
    create: [disallow("external")],
    update: [disallow("external")],
    patch: [disallow("external")],
    remove: [disallow("external")],
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
