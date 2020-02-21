const removeSoftDelete = require("../../hooks/remove-softdelete");
const registerRecord = require("./hooks/register-record");
const resctricUpdateRecord = require("./hooks/resctic-update-record");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerRecord()],
    update: [],
    patch: [resctricUpdateRecord()],
    remove: [removeSoftDelete()]
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
