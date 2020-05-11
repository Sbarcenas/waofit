const registerCoffeeShopProductsAttributes = require("./hooks/register-coffee-products-attrib");
const updateCoffeeProductsAttributes = require("./hooks/update-coffee-products-attrib");
const removeSoftdelete = require("../../hooks/remove-softdelete");
const { disallow } = require("feathers-hooks-common");
const { fastJoin } = require("feathers-hooks-common");

const fastJoinResponse = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_attributes_of_section] = await Promise.all([
        context.app.service("coffee-attributes-of-section").find({
          query: {
            coffee_products_attrib_id: records.id,
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

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerCoffeeShopProductsAttributes()],
    update: [disallow("external")],
    patch: [updateCoffeeProductsAttributes()],
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
