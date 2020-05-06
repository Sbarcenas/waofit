// Initializes the `coffee_shop_categories` service on path `/coffee-shop-categories`
const { CoffeeShopCategories } = require('./coffee_shop_categories.class');
const createModel = require('../../models/coffee_shop_categories.model');
const hooks = require('./coffee_shop_categories.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-shop-categories', new CoffeeShopCategories(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-shop-categories');

  service.hooks(hooks);
};
