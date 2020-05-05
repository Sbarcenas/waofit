// Initializes the `coffee hubs` service on path `/coffee-hubs`
const { CoffeeHubs } = require('./coffee-hubs.class');
const createModel = require('../../models/coffee-hubs.model');
const hooks = require('./coffee-hubs.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-hubs', new CoffeeHubs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-hubs');

  service.hooks(hooks);
};
