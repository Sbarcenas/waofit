// Initializes the `users-product-brand-favorites` service on path `/users-product-brand-favorites`
const { UsersProductBrandFavorites } = require('./users-product-brand-favorites.class');
const createModel = require('../../models/users-product-brand-favorites.model');
const hooks = require('./users-product-brand-favorites.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/users-product-brand-favorites', new UsersProductBrandFavorites(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users-product-brand-favorites');

  service.hooks(hooks);
};
