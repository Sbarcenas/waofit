// Initializes the `shopping cart details` service on path `/shopping-cart-details`
const { ShoppingCartDetails } = require('./shopping-cart-details.class');
const createModel = require('../../models/shopping-cart-details.model');
const hooks = require('./shopping-cart-details.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/shopping-cart-details', new ShoppingCartDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('shopping-cart-details');

  service.hooks(hooks);
};
