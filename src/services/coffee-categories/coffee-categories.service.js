// Initializes the `coffee categories` service on path `/coffee-categories`
const { CoffeeCategories } = require('./coffee-categories.class');
const createModel = require('../../models/coffee-categories.model');
const hooks = require('./coffee-categories.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-categories', new CoffeeCategories(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-categories');

  service.hooks(hooks);
};
