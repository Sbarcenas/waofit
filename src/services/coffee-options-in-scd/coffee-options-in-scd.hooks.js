const { disallow } = require("feathers-hooks-common");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const { fastJoin } = require("feathers-hooks-common");
const restrictBatchCreate = require("./hooks/restrict-batch-create");
const restrictRegisterOptionInScd = require("./hooks/restrict-register-options-in-scd");
const registerOptionsInScd = require("./hooks/register-options-in-scd");
const deleteOptionsInScd = require("./hooks/delete-options-in-scd");

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
    create: [
      restrictBatchCreate(),
      restrictRegisterOptionInScd(),
      registerOptionsInScd(),
    ],
    update: [disallow("external")],
    patch: [disallow("external")],
    remove: [disallow("external"), removeSoftDelete()],
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
