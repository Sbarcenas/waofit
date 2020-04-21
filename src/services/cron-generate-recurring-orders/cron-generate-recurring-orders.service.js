// Initializes the `cron-generate-recurring-orders` service on path `/cron-generate-recurring-orders`
const { CronGenerateRecurringOrders } = require('./cron-generate-recurring-orders.class');
const hooks = require('./cron-generate-recurring-orders.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/cron-generate-recurring-orders', new CronGenerateRecurringOrders(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('cron-generate-recurring-orders');

  service.hooks(hooks);
};
