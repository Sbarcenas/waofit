// Initializes the `users-credit-cards` service on path `/users-credit-cards`
const { UsersCreditCards } = require('./users-credit-cards.class');
const createModel = require('../../models/users-credit-cards.model');
const hooks = require('./users-credit-cards.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/users-credit-cards', new UsersCreditCards(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users-credit-cards');

  service.hooks(hooks);
};
