const registerFavorite = require("./hooks/register-favorite");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const { disallow, fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      let service = null;
      let query = null;
      switch (records.type) {
        case "product":
          service = "express-products";
          query = { id: records.type_id, deletedAt: null };
          break;
        case "brand":
          service = "brands";
          query = { id: records.type_id, deletedAt: null };
          break;
        case "blog":
          service = "blogs-and-guides";
          query = { id: records.type_id, deletedAt: null, type: "blog" };
          break;
        case "recipe":
          service = "recipes";
          query = { id: records.type_id, deletedAt: null };
          break;
        case "guide":
          service = "blogs-and-guides";
          query = { id: records.type_id, deletedAt: null, type: "guide" };
          break;
        default:
          break;
      }

      records.favorite = await context.app
        .service(service)
        .getModel()
        .query()
        .where(query)
        .then((it) => it[0]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerFavorite()],
    update: [],
    patch: [disallow("external")],
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
