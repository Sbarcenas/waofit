// Initializes the `express-products-orders` service on path `/express-products-orders`
const { ExpressProductsOrders } = require('./express-products-orders.class');
const createModel = require('../../models/express-products-orders.model');
const hooks = require('./express-products-orders.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/express-products-orders', new ExpressProductsOrders(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('express-products-orders');

  service.hooks(hooks);
};
