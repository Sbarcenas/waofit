const registerCoffeeShopProductsAttributes = require("./hooks/register-coffee-shop-products-attributes");
const updateCoffeeProductsAttributes = require("./hooks/update-coffee-shop-products-attributes");
const removeSoftdelete = require("../../hooks/remove-softdelete");
const { disallow } = require("feathers-hooks-common");
const { fastJoin } = require("feathers-hooks-common");

const fastJoinResponse = {
  joins: {
    join: () => async (records, context) => {
      [records.coffee_shop_products_attributes] = await Promise.all([
        context.app.service("coffee-shop-products-attributes-of-section").find({
          query: {
            coffee_shop_products_attributes_id: records.id,
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
