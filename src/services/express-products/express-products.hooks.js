const assingPathCategory = require("./hooks/assing-path-category");
const pushAlgolia = require("./hooks/push-algolia");
const prepareRecordsForAlgolia = require("./hooks/prepare-records-for-algolia");
const updateAlgolia = require("./hooks/update-algolia");
const removeAlgolia = require("./hooks/remove-algolia");
const registerProduct = require("./hooks/register-product");
const removeSoftDelete = require("../../hooks/remove-softdelete");

const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      const [countCalifications, sumCalifications] = await Promise.all([
        context.app
          .service("reviews")
          .getModel()
          .query()
          .count("*", { as: "quantity" })
          .where({
            type: "express-product",
            type_id: records.id,
            deletedAt: null
          }),
        context.app
          .service("reviews")
          .getModel()
          .query()
          .sum("stars", { as: "totalCalifications" })
          .where({
            type: "express-product",
            type_id: records.id,
            deletedAt: null
          })
      ]);
      records.rating_average =
        parseInt(sumCalifications[0].totalCalifications) /
        countCalifications[0].quantity;

      records.rating_average = records.rating_average
        ? records.rating_average
        : 0;
      records.count_reviews = countCalifications[0].quantity;
    }
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      registerProduct(),
      assingPathCategory(),
      prepareRecordsForAlgolia()
    ],
    update: [],
    patch: [prepareRecordsForAlgolia()],
    remove: [removeSoftDelete()]
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
    create: [pushAlgolia()],
    update: [],
    patch: [fastJoin(resolves), updateAlgolia()],
    remove: [removeAlgolia()]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
