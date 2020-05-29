const { fastJoin } = require("feathers-hooks-common");
const searhAdmin = require("./hooks/search-admin");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.order_status] = await Promise.all([
        context.app
          .service("orders-status")
          .getModel()
          .query()
          .where({ id: records.order_status_id, deletedAt: null })
          .then((it) => it[0]),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [searhAdmin()],
    get: [searhAdmin()],
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
