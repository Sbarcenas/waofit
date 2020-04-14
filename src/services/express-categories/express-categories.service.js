// Initializes the `express-categories` service on path `/express-categories`
const { ExpressCategories } = require("./express-categories.class");
const createModel = require("../../models/express-categories.model");
const hooks = require("./express-categories.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: {
      max: 5000,
      default: 200,
    },
  };

  // Initialize our service with any options it requires
  app.use("/express-categories", new ExpressCategories(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("express-categories");

  service.hooks(hooks);
};
