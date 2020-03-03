// Initializes the `shipping status` service on path `/shipping-status`
const { ShippingStatus } = require('./shipping-status.class');
const createModel = require('../../models/shipping-status.model');
const hooks = require('./shipping-status.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/shipping-status', new ShippingStatus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('shipping-status');

  service.hooks(hooks);
};
