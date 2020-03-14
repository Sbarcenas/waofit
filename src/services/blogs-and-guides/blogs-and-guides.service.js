// Initializes the `blogs and guides` service on path `/blogs-and-guides`
const { BlogsAndGuides } = require('./blogs-and-guides.class');
const createModel = require('../../models/blogs-and-guides.model');
const hooks = require('./blogs-and-guides.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/blogs-and-guides', new BlogsAndGuides(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('blogs-and-guides');

  service.hooks(hooks);
};
