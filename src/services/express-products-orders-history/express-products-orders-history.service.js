// Initializes the `express products orders history` service on path `/express-products-orders-history`
const { ExpressProductsOrdersHistory } = require('./express-products-orders-history.class');
const createModel = require('../../models/express-products-orders-history.model');
const hooks = require('./express-products-orders-history.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/express-products-orders-history', new ExpressProductsOrdersHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('express-products-orders-history');

  service.hooks(hooks);
};
