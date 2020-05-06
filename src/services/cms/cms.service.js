// Initializes the `cms` service on path `/cms`
const { Cms } = require('./cms.class');
const createModel = require('../../models/cms.model');
const hooks = require('./cms.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/cms', new Cms(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('cms');

  service.hooks(hooks);
};
