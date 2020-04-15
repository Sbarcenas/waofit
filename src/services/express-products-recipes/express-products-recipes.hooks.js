const registerRecipe = require("./hooks/register-recipe");
const retrictPatch = require("./hooks/restrict-patch");
const { fastJoin } = require("feathers-hooks-common");
const removeSoftDelete = require("../../hooks/remove-softdelete");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.express_product, records.recipe] = await Promise.all([
        context.app
          .service("express-products")
          .getModel()
          .query()
          .where({ id: records.express_product_id })
          .then((it) => it[0]),
        context.app
          .service("recipes")
          .getModel()
          .query()
          .where({ id: records.recipe_id })
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
    create: [registerRecipe()],
    update: [],
    patch: [retrictPatch()],
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
