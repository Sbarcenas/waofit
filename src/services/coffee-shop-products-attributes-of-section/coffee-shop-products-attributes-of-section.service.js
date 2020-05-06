// Initializes the `coffee shop products attributes of section` service on path `/coffee-shop-products-attributes-of-section`
const { CoffeeShopProductsAttributesOfSection } = require('./coffee-shop-products-attributes-of-section.class');
const createModel = require('../../models/coffee-shop-products-attributes-of-section.model');
const hooks = require('./coffee-shop-products-attributes-of-section.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-shop-products-attributes-of-section', new CoffeeShopProductsAttributesOfSection(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-shop-products-attributes-of-section');

  service.hooks(hooks);
};
