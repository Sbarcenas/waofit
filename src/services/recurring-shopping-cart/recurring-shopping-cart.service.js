// Initializes the `recurring shopping cart` service on path `/recurring-shopping-cart`
const { RecurringShoppingCart } = require('./recurring-shopping-cart.class');
const createModel = require('../../models/recurring-shopping-cart.model');
const hooks = require('./recurring-shopping-cart.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/recurring-shopping-cart', new RecurringShoppingCart(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('recurring-shopping-cart');

  service.hooks(hooks);
};
