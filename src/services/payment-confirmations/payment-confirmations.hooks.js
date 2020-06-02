const registerPaymentConfirmation = require("./hooks/register-payment-confirmation");
const registerPaymentConfirmationAdmin = require("./hooks/register-payment-confirmation-admin");
const registerPaymentConfirmationAdminAfterCreate = require("./hooks/register-payment-confirmation-admin-after-create");
const { iff, isProvider, disallow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iff(isProvider("external"), registerPaymentConfirmationAdmin()),
      registerPaymentConfirmation(),
    ],
    update: [disallow("external")],
    patch: [disallow("external")],
    remove: [disallow("external")],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      iff(
        isProvider("external"),
        registerPaymentConfirmationAdminAfterCreate()
      ),
    ],
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
