const RegisterShippping = require("./hooks/register-shipping");
const UpdateShiping = require("./hooks/update-shipping");
const UpdateShipingAfterUpdate = require("./hooks/update-shipping-after-update");

const { disallow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [RegisterShippping()],
    update: [disallow("external")],
    patch: [UpdateShiping()],
    remove: [disallow("external")],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [UpdateShipingAfterUpdate()],
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
