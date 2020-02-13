const processReviewsAfterCreateTypeProduct = require("./hooks/process-reviews-after-create-type-product");
const processReviewsBeforeCreate = require("./hooks/process-reviews-before-create");
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [processReviewsBeforeCreate()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [processReviewsAfterCreateTypeProduct()],
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
