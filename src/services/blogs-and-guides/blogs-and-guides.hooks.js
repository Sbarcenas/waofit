const registerBlogGuide = require("./hooks/register-blog-guide");
const removeAlgolia = require("./hooks/remove-algolia");
const updateAlgolia = require("./hooks/update-algolia");
const restricActiveBeforePatch = require("./hooks/restric-active-before-patch");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const searchAdmin = require("./hooks/search-admin");
const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      //aqui hacer lo mismo con los tipos blogs y guide y listo el pollo

      let query = null;
      if (records.type == "blog")
        query = { type: "blog", type_id: records.id, deletedAt: null };
      else query = { type: "guide", type_id: records.id, deletedAt: null };

      const [countCalifications, sumCalifications] = await Promise.all([
        context.app
          .service("reviews")
          .getModel()
          .query()
          .count("*", { as: "quantity" })
          .where({
            ...query,
          }),
        context.app
          .service("reviews")
          .getModel()
          .query()
          .sum("stars", { as: "totalCalifications" })
          .where({
            ...query,
          }),
      ]);
      records.rating_average =
        parseInt(sumCalifications[0].totalCalifications) /
        countCalifications[0].quantity;

      records.rating_average = records.rating_average
        ? records.rating_average
        : 0;
      records.count_reviews = countCalifications[0].quantity;

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
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [registerBlogGuide()],
    update: [],
    patch: [restricActiveBeforePatch()],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
    create: [],
    update: [],
    patch: [updateAlgolia()],
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
