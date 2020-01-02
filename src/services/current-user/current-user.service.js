// Initializes the `current-user` service on path `/current-user`
const { CurrentUser } = require('./current-user.class');
const hooks = require('./current-user.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/current-user', new CurrentUser(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('current-user');

  service.hooks(hooks);
};
