const sendNotificationsBC = require('./hooks/send-notifications-b-c');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      sendNotificationsBC()
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
