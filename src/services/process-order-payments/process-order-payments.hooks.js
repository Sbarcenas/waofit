const processOrderPaymentsBeforeCreate = require("./hooks/process-order-payments-before-create");
const processOrderPaymentsAfterCreate = require("./hooks/process-order-payments-after-create");
const { disallow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [disallow()],
    get: [disallow()],
    create: [processOrderPaymentsBeforeCreate()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [processOrderPaymentsAfterCreate()],
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
