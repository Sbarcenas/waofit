const RegisterShippping = require("./hooks/register-shipping");
const UpdateShiping = require("./hooks/update-shipping");
const UpdateShipingAfterUpdate = require("./hooks/update-shipping-after-update");
const UpdateDelivered = require("./hooks/update-delivered");
const UpdateDeliveredAfterPatch = require("./hooks/update-delivered-after-patch");

const { disallow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [RegisterShippping()],
    update: [disallow("external")],
    patch: [UpdateShiping(), UpdateDelivered()],
    remove: [disallow("external")],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [UpdateShipingAfterUpdate(), UpdateDeliveredAfterPatch()],
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
