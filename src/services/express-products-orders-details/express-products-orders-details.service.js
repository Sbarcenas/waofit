// Initializes the `express products orders details` service on path `/express-products-orders-details`
const { ExpressProductsOrdersDetails } = require('./express-products-orders-details.class');
const createModel = require('../../models/express-products-orders-details.model');
const hooks = require('./express-products-orders-details.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/express-products-orders-details', new ExpressProductsOrdersDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('express-products-orders-details');

  service.hooks(hooks);
};
