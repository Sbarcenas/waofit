// Initializes the `users-addresses` service on path `/users-addresses`
const { UsersAddresses } = require('./users-addresses.class');
const createModel = require('../../models/users-addresses.model');
const hooks = require('./users-addresses.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/users-addresses', new UsersAddresses(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users-addresses');

  service.hooks(hooks);
};
