// Initializes the `orders-status` service on path `/orders-status`
const { OrdersStatus } = require('./orders-status.class');
const createModel = require('../../models/orders-status.model');
const hooks = require('./orders-status.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/orders-status', new OrdersStatus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('orders-status');

  service.hooks(hooks);
};
