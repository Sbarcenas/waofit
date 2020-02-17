const preparePushHubsAlgolia = require("./hooks/prepare-push-hubs-algolia");
const pushHubsAlgolia = require("./hooks/push-hubs-algolia");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [preparePushHubsAlgolia()],
    update: [],
    patch: [],
    remove: []
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
