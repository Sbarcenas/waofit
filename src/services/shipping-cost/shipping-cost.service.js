// Initializes the `shipping cost` service on path `/shipping-cost`
const { ShippingCost } = require('./shipping-cost.class');
const createModel = require('../../models/shipping-cost.model');
const hooks = require('./shipping-cost.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/shipping-cost', new ShippingCost(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('shipping-cost');

  service.hooks(hooks);
};
