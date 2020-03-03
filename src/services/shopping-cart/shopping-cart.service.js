// Initializes the `shopping-cart` service on path `/shopping-cart`
const { ShoppingCart } = require('./shopping-cart.class');
const createModel = require('../../models/shopping-cart.model');
const hooks = require('./shopping-cart.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/shopping-cart', new ShoppingCart(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('shopping-cart');

  service.hooks(hooks);
};
