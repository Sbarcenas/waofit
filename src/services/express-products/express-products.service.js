// Initializes the `express-products` service on path `/express-products`
const { ExpressProducts } = require("./express-products.class");
const createModel = require("../../models/express-products.model");
const hooks = require("./express-products.hooks");

module.exports = function(app) {
  const options = {
    Model: createModel(app),
    whitelist: ["$eager", "$joinRelation"],
    allowedEager: "[category, brand, tax, hubs]",
    paginate: app.get("paginate")
  };

  // Initialize our service with any options it requires
  app.use("/express-products", new ExpressProducts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("express-products");

  service.hooks(hooks);
};
