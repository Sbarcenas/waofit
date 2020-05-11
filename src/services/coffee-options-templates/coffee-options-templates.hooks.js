const registerTemplate = require("./hooks/resgister-template");
// const updateTempate = require("./hooks/update-template");
const removeSoftdelete = require("../../hooks/remove-softdelete");
const { fastJoin } = require("feathers-hooks-common");

const fastJoinResponse = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_products_attrib] = await Promise.all([
        context.app.service("coffee-products-attrib").find({
          query: {
            id: records.coffee_options_template_id,
            deletedAt: null,
            $sort: {
              position: -1,
            },
          },
          paginate: false,
        }),
      ]);
    },
  },
};

const { disallow } = require("feathers-hooks-common");
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerTemplate()],
    update: [disallow("external")],
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
