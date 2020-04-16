// Initializes the `calculate next delivery` service on path `/calculate-next-delivery`
const { CalculateNextDelivery } = require('./calculate-next-delivery.class');
const hooks = require('./calculate-next-delivery.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/calculate-next-delivery', new CalculateNextDelivery(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('calculate-next-delivery');

  service.hooks(hooks);
};
