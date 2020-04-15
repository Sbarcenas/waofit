const activateRecipe = require("./hooks/activate-recipe");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const removeAlgolia = require("./hooks/remove-algolia");
const updateAlgolia = require("./hooks/update-algolia");

const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.author] = await Promise.all([
        context.app
          .service("authors")
          .getModel()
          .query()
          .where({ id: records.author_id, deletedAt: null })
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
    patch: [activateRecipe()],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
    create: [],
    update: [],
    patch: [fastJoin(resolves), updateAlgolia()],
    remove: [removeAlgolia()],
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
