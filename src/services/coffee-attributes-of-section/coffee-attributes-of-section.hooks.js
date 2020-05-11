const registerAttribute = require("./hooks/register-attribute");
const removeSoftdelete = require("../../hooks/remove-softdelete");
const { fastJoin } = require("feathers-hooks-common");

const fastJoinResponse = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_products_attrib, records.taxRule] = await Promise.all([
        context.app
          .service("coffee-shop-attributes")
          .find({
            query: { id: records.coffee_shop_attributes_id, deletedAt: null },
            paginate: false,
          })
          .then((it) => it[0]),
        context.app
          .service("tax-rule")
          .find({
            query: { id: records.tax_rule_id, deletedAt: null },
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
    create: [registerAttribute()],
    update: [],
    patch: [],
    remove: [removeSoftdelete()],
  },

  after: {
    all: [],
    find: [fastJoin(fastJoinResponse)],
    get: [fastJoin(fastJoinResponse)],
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
