const removeSoftDelete = require("../../hooks/remove-softdelete");
const { fastJoin, disallow } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_attributes_of_section] = await Promise.all([
        context.app
          .service("coffee-attributes-of-section")
          .find({
            query: {
              id: records.coffee_attributes_of_section_id,
              deletedAt: null,
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
    find: [disallow("external")],
    get: [disallow("external")],
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
