// Initializes the `coffee shop products attributes` service on path `/coffee-shop-products-attributes`
const { CoffeeShopProductsAttributes } = require('./coffee-shop-products-attributes.class');
const createModel = require('../../models/coffee-shop-products-attributes.model');
const hooks = require('./coffee-shop-products-attributes.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-shop-products-attributes', new CoffeeShopProductsAttributes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-shop-products-attributes');

  service.hooks(hooks);
};
