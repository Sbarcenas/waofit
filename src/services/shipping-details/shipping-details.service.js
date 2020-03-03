// Initializes the `shipping details` service on path `/shipping-details`
const { ShippingDetails } = require('./shipping-details.class');
const createModel = require('../../models/shipping-details.model');
const hooks = require('./shipping-details.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/shipping-details', new ShippingDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('shipping-details');

  service.hooks(hooks);
};
