// Initializes the `recovery-password` service on path `/recovery-password`
const { RecoveryPassword } = require('./recovery-password.class');
const hooks = require('./recovery-password.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/recovery-password', new RecoveryPassword(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('recovery-password');

  service.hooks(hooks);
};
