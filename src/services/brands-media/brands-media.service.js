// Initializes the `brands-media` service on path `/brands-media`
const { BrandsMedia } = require('./brands-media.class');
const createModel = require('../../models/brands-media.model');
const hooks = require('./brands-media.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/brands-media', new BrandsMedia(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('brands-media');

  service.hooks(hooks);
};
