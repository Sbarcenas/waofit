const assingPathCategory = require("./hooks/assing-path-category");
const pushAlgolia = require("./hooks/push-algolia");
const prepareRecordsForAlgolia = require("./hooks/prepare-records-for-algolia");
const updateAlgolia = require("./hooks/update-algolia");

const { discard, iff, isProvider, disallow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [assingPathCategory(), prepareRecordsForAlgolia()],
    update: [],
    patch: [iff(isProvider("external"), prepareRecordsForAlgolia())],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [pushAlgolia()],
    update: [],
    patch: [updateAlgolia()],
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
