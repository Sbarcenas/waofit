// Initializes the `coffee orders` service on path `/coffee-orders`
const { CoffeeOrders } = require('./coffee-orders.class');
const createModel = require('../../models/coffee-orders.model');
const hooks = require('./coffee-orders.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-orders', new CoffeeOrders(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-orders');

  service.hooks(hooks);
};
