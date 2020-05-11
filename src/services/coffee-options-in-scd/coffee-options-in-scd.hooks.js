const { disallow } = require("feathers-hooks-common");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_options] = await Promise.all([
        context.app
          .service("coffee-options")
          .find({
            query: {
              id: records.id,
            },
            paginate: false,
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
    create: [disallow("external")],
    update: [disallow("external")],
    patch: [disallow("external")],
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
