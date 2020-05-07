// Initializes the `coffee options templates` service on path `/coffee-options-templates`
const { CoffeeOptionsTemplates } = require('./coffee-options-templates.class');
const createModel = require('../../models/coffee-options-templates.model');
const hooks = require('./coffee-options-templates.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/coffee-options-templates', new CoffeeOptionsTemplates(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('coffee-options-templates');

  service.hooks(hooks);
};
