const RegisterShippingDetail = require("./hooks/register-shipping-detail");
const RestricUpdateQuantity = require("./hooks/restrict-update-quantity-shipped");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [RegisterShippingDetail()],
    update: [],
    patch: [RestricUpdateQuantity()],
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
