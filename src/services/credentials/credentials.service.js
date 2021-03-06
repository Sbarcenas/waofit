// Initializes the `credentials` service on path `/credentials`
const { Credentials } = require('./credentials.class');
const createModel = require('../../models/credentials.model');
const hooks = require('./credentials.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/credentials', new Credentials(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('credentials');

  service.hooks(hooks);
};
