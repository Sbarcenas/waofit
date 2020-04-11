const RegisterShippingDetail = require("./hooks/register-shipping-detail");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [RegisterShippingDetail()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
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
