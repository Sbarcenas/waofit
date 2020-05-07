const registerAttribute = require("./hooks/register-attribute");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerAttribute()],
    update: [],
    patch: [],
    remove: [],
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
