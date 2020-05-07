const registerTemplate = require("./hooks/resgister-template");
// const updateTempate = require("./hooks/update-template");
const removeSoftdelete = require("../../hooks/remove-softdelete");

const { disallow } = require("feathers-hooks-common");
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerTemplate()],
    update: [disallow("external")],
    patch: [],
    remove: [removeSoftdelete()],
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
