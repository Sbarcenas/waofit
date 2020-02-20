const removeSoftDelete = require("../../hooks/remove-softdelete");
const processMediaBeforeCreate = require("./hooks/process-media-before-create");
const switchMainImage = require("./hooks/switch-main-image");
const processUpdateGalery = require("./hooks/process-update-galery");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [processMediaBeforeCreate()],
    update: [],
    patch: [processUpdateGalery()],
    remove: [removeSoftDelete()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [switchMainImage()],
    update: [],
    patch: [switchMainImage()],
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
