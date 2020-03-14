const registerBlogGuide = require("./hooks/register-blog-guide");
const removeAlgolia = require("./hooks/remove-algolia");
const updateAlgolia = require("./hooks/update-algolia");
const restricActiveBeforePatch = require("./hooks/restric-active-before-patch");
const removeSoftDelete = require("../../hooks/remove-softdelete");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerBlogGuide()],
    update: [],
    patch: [restricActiveBeforePatch()],
    remove: [removeSoftDelete()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [updateAlgolia()],
    remove: [removeAlgolia()]
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
