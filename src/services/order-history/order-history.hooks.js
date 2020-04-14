const { authenticate } = require("@feathersjs/authentication").hooks;
const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.order_status, records.user] = await Promise.all([
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
          .where({ id: records.user_id })
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
