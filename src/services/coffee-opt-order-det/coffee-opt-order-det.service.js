// Initializes the `coffee opt order det` service on path `/coffee-opt-order-det`
const { CoffeeOptOrderDet } = require('./coffee-opt-order-det.class');
const createModel = require('../../models/coffee-opt-order-det.model');
const hooks = require('./coffee-opt-order-det.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-opt-order-det', new CoffeeOptOrderDet(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-opt-order-det');

  service.hooks(hooks);
};
