const usersAddressesBC = require("./hooks/users-addresses-b-c");
const usersAddressesAC = require("./hooks/users-addreeses-a-c");
const usersAddressesAP = require("./hooks/users-addresses-a-p");
const validationOfFields = require("../../hooks/validations-of-fields");
const removeSoftDelete = require("../../hooks/remove-softdelete");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validationOfFields(), usersAddressesBC()],
    update: [],
    patch: [],
    remove: [removeSoftDelete()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [usersAddressesAC()],
    update: [],
    patch: [usersAddressesAP()],
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
