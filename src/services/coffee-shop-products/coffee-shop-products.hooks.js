const registerCoffeeProduct = require("./hooks/register-coffee-product");
const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [
        records.coffee_options_template,
        records.user_addresses,
      ] = await Promise.all([
        context.app
          .service("coffee-options-templates")
          .find({
            query: { id: coffee_options_template_id, deletedAt: null },
            paginate: false,
          }),
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
    find: [],
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
