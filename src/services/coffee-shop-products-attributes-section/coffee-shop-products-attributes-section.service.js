// Initializes the `coffee shop products attributes section` service on path `/coffee-shop-products-attributes-section`
const { CoffeeShopProductsAttributesSection } = require('./coffee-shop-products-attributes-section.class');
const createModel = require('../../models/coffee-shop-products-attributes-section.model');
const hooks = require('./coffee-shop-products-attributes-section.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-shop-products-attributes-section', new CoffeeShopProductsAttributesSection(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-shop-products-attributes-section');

  service.hooks(hooks);
};
