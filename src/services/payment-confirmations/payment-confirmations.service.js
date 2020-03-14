// Initializes the `payment-confirmations` service on path `/payment-confirmations`
const { PaymentConfirmations } = require('./payment-confirmations.class');
const createModel = require('../../models/payment-confirmations.model');
const hooks = require('./payment-confirmations.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/payment-confirmations', new PaymentConfirmations(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment-confirmations');

  service.hooks(hooks);
};
