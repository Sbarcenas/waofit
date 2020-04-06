// Initializes the `express-products-hubs` service on path `/express-products-hubs`
const { ExpressProductsHubs } = require("./express-products-hubs.class");
const createModel = require("../../models/express-products-hubs.model");
const hooks = require("./express-products-hubs.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    whitelist: ["$eager", "$joinRelation"],
    allowedEager: "[hubs,products]",
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/express-products-hubs", new ExpressProductsHubs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("express-products-hubs");

  service.hooks(hooks);
};
