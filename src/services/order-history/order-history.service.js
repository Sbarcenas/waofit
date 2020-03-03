// Initializes the `order history` service on path `/order-history`
const { OrderHistory } = require('./order-history.class');
const createModel = require('../../models/order-history.model');
const hooks = require('./order-history.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/order-history', new OrderHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('order-history');

  service.hooks(hooks);
};
