const recoveryPasswordBC = require('./hooks/recovery-password-b-c');
const recoveryPasswordBP = require('./hooks/recovery-password-b-p');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      recoveryPasswordBC()
    ],
    update: [],
    patch: [
      recoveryPasswordBP()
    ],
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
    all: [
      // showErrors()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
