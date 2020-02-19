const preparePushHubsAlgolia = require("./hooks/prepare-push-hubs-algolia");
const pushHubsAlgolia = require("./hooks/push-hubs-algolia");
const removeSoftDelete = require("../../hooks/remove-softdelete");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [preparePushHubsAlgolia()],
    update: [],
    patch: [],
    remove: [removeSoftDelete()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [pushHubsAlgolia()],
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
