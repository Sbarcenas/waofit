// Initializes the `brands-media-options` service on path `/brands-media-options`
const { BrandsMediaOptions } = require('./brands-media-options.class');
const createModel = require('../../models/brands-media-options.model');
const hooks = require('./brands-media-options.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/brands-media-options', new BrandsMediaOptions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('brands-media-options');

  service.hooks(hooks);
};
