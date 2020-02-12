// Initializes the `express-nu-ta-opt` service on path `/express-nu-ta-opt`
const { ExpressNuTaOpt } = require('./express-nu-ta-opt.class');
const createModel = require('../../models/express-nu-ta-opt.model');
const hooks = require('./express-nu-ta-opt.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/express-nu-ta-opt', new ExpressNuTaOpt(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('express-nu-ta-opt');

  service.hooks(hooks);
};
