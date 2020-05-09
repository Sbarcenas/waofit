// Initializes the `coffee options in shopping cart details` service on path `/coffee-options-in-shopping-cart-details`
const { CoffeeOptionsInShoppingCartDetails } = require('./coffee-options-in-shopping-cart-details.class');
const createModel = require('../../models/coffee-options-in-shopping-cart-details.model');
const hooks = require('./coffee-options-in-shopping-cart-details.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-options-in-shopping-cart-details', new CoffeeOptionsInShoppingCartDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-options-in-shopping-cart-details');

  service.hooks(hooks);
};
