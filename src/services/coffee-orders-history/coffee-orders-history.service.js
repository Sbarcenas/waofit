// Initializes the `coffee orders history` service on path `/coffee-orders-history`
const { CoffeeOrdersHistory } = require('./coffee-orders-history.class');
const createModel = require('../../models/coffee-orders-history.model');
const hooks = require('./coffee-orders-history.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-orders-history', new CoffeeOrdersHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-orders-history');

  service.hooks(hooks);
};
