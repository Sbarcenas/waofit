const createRecurringShoppingCart = require("./hooks/create-recurring-shopping-cart");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const activateRecurrindShoppingCart = require("./hooks/activate-recurring-shopping-cart");
const searchAdmin = require("./hooks/search-admin");

const { fastJoin } = require("feathers-hooks-common");
const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.user] = await Promise.all([
        context.app
          .service("users")
          .getModel()
          .query()
          .select("first_name", "last_name", "email", "phone", "gender")
          .where({ id: records.user_id })
          .then((it) => it[0]),
      ]);
    },
  },
};
module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [createRecurringShoppingCart()],
    update: [],
    patch: [activateRecurrindShoppingCart()],
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
