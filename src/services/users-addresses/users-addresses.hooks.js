const usersAddressesBC = require("./hooks/users-addresses-b-c");
const usersAddressesAC = require("./hooks/users-addreeses-a-c");
const usersAddressesAP = require("./hooks/users-addresses-a-p");
const validationOfFields = require("../../hooks/validations-of-fields");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const searchAdmin = require("./hooks/search-admin");

const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.state, records.city] = await Promise.all([
        context.app
          .service("locations-states")
          .getModel()
          .query()
          .where({ id: records.state_id, deletedAt: null })
          .then((it) => it[0]),
        context.app
          .service("locations-cities")
          .getModel()
          .query()
          .where({ id: records.city_id, deletedAt: null })
          .then((it) => it[0]),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [validationOfFields(), usersAddressesBC()],
    update: [],
    patch: [],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
    create: [usersAddressesAC()],
    update: [],
    patch: [usersAddressesAP()],
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
