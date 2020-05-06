// Initializes the `coffee_shop_attributes` service on path `/coffee-shop-attributes`
const { CoffeeShopAttributes } = require('./coffee_shop_attributes.class');
const createModel = require('../../models/coffee_shop_attributes.model');
const hooks = require('./coffee_shop_attributes.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-shop-attributes', new CoffeeShopAttributes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-shop-attributes');

  service.hooks(hooks);
};
