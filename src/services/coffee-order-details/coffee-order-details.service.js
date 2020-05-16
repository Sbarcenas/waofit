// Initializes the `coffee order details` service on path `/coffee-order-details`
const { CoffeeOrderDetails } = require('./coffee-order-details.class');
const createModel = require('../../models/coffee-order-details.model');
const hooks = require('./coffee-order-details.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-order-details', new CoffeeOrderDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-order-details');

  service.hooks(hooks);
};
