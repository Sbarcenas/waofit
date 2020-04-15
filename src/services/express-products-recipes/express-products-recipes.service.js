// Initializes the `express-products-recipes` service on path `/express-products-recipes`
const { ExpressProductsRecipes } = require('./express-products-recipes.class');
const createModel = require('../../models/express-products-recipes.model');
const hooks = require('./express-products-recipes.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/express-products-recipes', new ExpressProductsRecipes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('express-products-recipes');

  service.hooks(hooks);
};
