// Initializes the `process payment response` service on path `/process-payment-response`
const { ProcessPaymentResponse } = require('./process-payment-response.class');
const hooks = require('./process-payment-response.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/process-payment-response', new ProcessPaymentResponse(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('process-payment-response');

  service.hooks(hooks);
};
