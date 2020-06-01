const registerPaymentConfirmation = require("./hooks/register-payment-confirmation");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerPaymentConfirmation()],
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
