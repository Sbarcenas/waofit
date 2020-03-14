// Initializes the `payment-confirmations-epayco` service on path `/payment-confirmations-epayco`
const { PaymentConfirmationsEpayco } = require('./payment-confirmations-epayco.class');
const hooks = require('./payment-confirmations-epayco.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/payment-confirmations-epayco', new PaymentConfirmationsEpayco(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment-confirmations-epayco');

  service.hooks(hooks);
};
