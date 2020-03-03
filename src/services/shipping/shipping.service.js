// Initializes the `shipping` service on path `/shipping`
const { Shipping } = require('./shipping.class');
const createModel = require('../../models/shipping.model');
const hooks = require('./shipping.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/shipping', new Shipping(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('shipping');

  service.hooks(hooks);
};
