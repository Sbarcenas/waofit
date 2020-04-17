// Initializes the `shipping costs` service on path `/shipping-costs`
const { ShippingCosts } = require('./shipping-costs.class');
const createModel = require('../../models/shipping-costs.model');
const hooks = require('./shipping-costs.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/shipping-costs', new ShippingCosts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('shipping-costs');

  service.hooks(hooks);
};
