const registerCoffeeShopProductsAttributes = require("./hooks/register-coffee-products-attrib");
const updateCoffeeProductsAttributes = require("./hooks/update-coffee-products-attrib");
const removeSoftdelete = require("../../hooks/remove-softdelete");
const restrictRemove = require("./hooks/restrict-delete");
const { disallow } = require("feathers-hooks-common");
const { fastJoin } = require("feathers-hooks-common");
const searchAdmin = require("./hooks/search-admin");

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
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [registerCoffeeShopProductsAttributes()],
    update: [disallow("external")],
    patch: [updateCoffeeProductsAttributes()],
    remove: [restrictRemove(), removeSoftdelete()],
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
