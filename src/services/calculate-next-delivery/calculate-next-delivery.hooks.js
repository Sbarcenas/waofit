const calculareNextDeliveryResponse = require("./hooks/calculate-next-delivery-response");

module.exports = {
  before: {
    all: [],
    find: [calculareNextDeliveryResponse()],
    get: [calculareNextDeliveryResponse()],
    create: [],
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
