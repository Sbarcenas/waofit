// Initializes the `authors` service on path `/authors`
const { Authors } = require('./authors.class');
const createModel = require('../../models/authors.model');
const hooks = require('./authors.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/authors', new Authors(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('authors');

  service.hooks(hooks);
};
