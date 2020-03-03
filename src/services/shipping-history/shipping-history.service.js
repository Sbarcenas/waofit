// Initializes the `shipping history` service on path `/shipping-history`
const { ShippingHistory } = require('./shipping-history.class');
const createModel = require('../../models/shipping-history.model');
const hooks = require('./shipping-history.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/shipping-history', new ShippingHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('shipping-history');

  service.hooks(hooks);
};
