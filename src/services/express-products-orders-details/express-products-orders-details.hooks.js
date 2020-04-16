const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.express_product] = await Promise.all([
        context.app
          .service("express-products")
          .find({
            query: {
              id: records.express_product_id,
            },
            paginate: false,
            disableSoftDelete: true,
          })
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
