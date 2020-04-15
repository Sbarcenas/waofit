// Initializes the `express-hubs` service on path `/express-hubs`
const { ExpressHubs } = require("./express-hubs.class");
const createModel = require("../../models/express-hubs.model");
const hooks = require("./express-hubs.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: {
      max: 5000,
      default: 100,
    },
  };

  // Initialize our service with any options it requires
  app.use("/express-hubs", new ExpressHubs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("express-hubs");

  service.hooks(hooks);
};
