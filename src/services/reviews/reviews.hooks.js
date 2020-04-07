const processReviewsAfterCreateTypeProduct = require("./hooks/process-reviews-after-create-type-product");
const processReviewsBeforeCreate = require("./hooks/process-reviews-before-create");
const removeSoftDelete = require("../../hooks/remove-softdelete");

const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      records.user = await context.app
        .service("users")
        .getModel()
        .query()
        .select("first_name", "last_name", "email", "profile_picture")
        .where({ id: records.user_id })
        .then((it) => it[0]);
      switch (records.type) {
        case "express-product":
          records.express_product = await context.app
            .service("express-products")
            .getModel()
            .query()
            .where({ id: records.type_id })
            .then((it) => it[0]);
          break;
        case "guide":
          records[records.type] = await context.app
            .service("blogs-and-guides")
            .getModel()
            .query()
            .where({ id: records.type_id })
            .then((it) => it[0]);
          break;
        case "blog":
          records[records.type] = await context.app
            .service("blogs-and-guides")
            .getModel()
            .query()
            .where({ id: records.type_id })
            .then((it) => it[0]);
          break;
        /* case "recipe":
          records.blog = await context.app
            .service("recipes")
            .getModel()
            .query()
            .where({ id: records.type_id })
            .then((it) => it[0]);
          break; */
      }
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [processReviewsBeforeCreate()],
    update: [],
    patch: [],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
    create: [processReviewsAfterCreateTypeProduct()],
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
