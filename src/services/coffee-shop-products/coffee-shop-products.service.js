// Initializes the `coffee shop products` service on path `/coffee-shop-products`
const { CoffeeShopProducts } = require('./coffee-shop-products.class');
const createModel = require('../../models/coffee-shop-products.model');
const hooks = require('./coffee-shop-products.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-shop-products', new CoffeeShopProducts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-shop-products');

  service.hooks(hooks);
};
