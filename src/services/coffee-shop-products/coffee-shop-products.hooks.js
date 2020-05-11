const registerCoffeeProduct = require("./hooks/register-coffee-product");
const removeSoftdelete = require("../../hooks/remove-softdelete");
const restrictActivateCoffeeShopProduct = require("./hooks/retrict-activate-coffee-shop-product");
const updateAlgolia = require("./hooks/update-algolia");

const {
  fastJoin,
  disallow,
  iff,
  isProvider,
} = require("feathers-hooks-common");

const fastJoinResponse = {
  joins: {
    join: () => async (records, context) => {
      [
        records.coffee_shop_category,
        records.coffee_options_template,
      ] = await Promise.all([
        context.app
          .service("coffee-shop-categories")
          .getModel()
          .query()
          .where({ id: records.coffee_shop_category_id, deletedAt: null })
          .then((it) => it[0]),
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

const fastJoinAlgolia = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_shop_category] = await Promise.all([
        context.app
          .service("coffee-shop-categories")
          .getModel()
          .query()
          .where({ id: records.coffee_shop_category_id, deletedAt: null })
          .then((it) => it[0]),
      ]);
    },
  },
};

const fastJoinInternal = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_shop_category] = await Promise.all([
        context.app
          .service("coffee-shop-categories")
          .getModel()
          .query()
          .where({ id: records.coffee_shop_category_id, deletedAt: null })
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
    update: [disallow()],
    patch: [restrictActivateCoffeeShopProduct()],
    remove: [removeSoftdelete()],
  },

  after: {
    all: [],
    find: [
      iff(isProvider("external"), fastJoin(fastJoinResponse)),
      iff(isProvider("internal"), fastJoin(fastJoinInternal)),
    ],
    get: [
      iff(isProvider("external"), fastJoin(fastJoinResponse)),
      iff(isProvider("internal"), fastJoin(fastJoinInternal)),
    ],
    create: [],
    update: [],
    patch: [
      iff(isProvider("external"), fastJoin(fastJoinAlgolia), updateAlgolia()),
    ],
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
