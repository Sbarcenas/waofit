// Initializes the `coffee options in shopping cart details` service on path `/coffee-options-in-scd`
const {
  CoffeeOptionsInShoppingCartDetails,
} = require("./coffee-options-in-scd.class");
const createModel = require("../../models/coffee-options-in-scd.model");
const hooks = require("./coffee-options-in-scd.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/coffee-options-in-scd",
    new CoffeeOptionsInShoppingCartDetails(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("coffee-options-in-scd");

  service.hooks(hooks);
};
