const registerCoffeeProduct = require("./hooks/register-coffee-product");
const { fastJoin } = require("feathers-hooks-common");

const fastJoinResponse = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_options_template] = await Promise.all([
        context.app
          .service("coffee-options-templates")
          .find({
            query: { id: records.coffee_options_template_id, deletedAt: null },
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
    create: [registerCoffeeProduct()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [fastJoin(fastJoinResponse)],
    get: [],
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
