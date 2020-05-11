// Initializes the `coffee shop products attributes` service on path `/coffee-products-attrib`
const {
  CoffeeShopProductsAttributes,
} = require("./coffee-products-attrib.class");
const createModel = require("../../models/coffee-products-attrib.model");
const hooks = require("./coffee-products-attrib.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/coffee-products-attrib",
    new CoffeeShopProductsAttributes(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("coffee-products-attrib");

  service.hooks(hooks);
};
