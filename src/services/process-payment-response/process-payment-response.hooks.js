const processPaymentResponseBeforeCreate = require("./hooks/process-payment-response-before-create");
const { disallow } = require("feathers-hooks-common");
module.exports = {
  before: {
    all: [],
    find: [disallow()],
    get: [disallow()],
    create: [processPaymentResponseBeforeCreate()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
