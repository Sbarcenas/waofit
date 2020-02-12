// Initializes the `express-products-media` service on path `/express-products-media`
const { ExpressProductsMedia } = require('./express-products-media.class');
const createModel = require('../../models/express-products-media.model');
const hooks = require('./express-products-media.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/express-products-media', new ExpressProductsMedia(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('express-products-media');

  service.hooks(hooks);
};
