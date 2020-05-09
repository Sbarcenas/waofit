// Initializes the `coffee options` service on path `/coffee-options`
const { CoffeeOptions } = require('./coffee-options.class');
const createModel = require('../../models/coffee-options.model');
const hooks = require('./coffee-options.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-options', new CoffeeOptions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-options');

  service.hooks(hooks);
};
