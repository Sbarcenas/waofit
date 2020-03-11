// Initializes the `process-order-payments` service on path `/process-order-payments`
const { ProcessOrderPayments } = require('./process-order-payments.class');
const hooks = require('./process-order-payments.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/process-order-payments', new ProcessOrderPayments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('process-order-payments');

  service.hooks(hooks);
};
