// Initializes the `recurring-shopping-cart-details` service on path `/recurring-shopping-cart-details`
const { RecurringShoppingCartDetails } = require('./recurring-shopping-cart-details.class');
const createModel = require('../../models/recurring-shopping-cart-details.model');
const hooks = require('./recurring-shopping-cart-details.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/recurring-shopping-cart-details', new RecurringShoppingCartDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('recurring-shopping-cart-details');

  service.hooks(hooks);
};
