// Initializes the `locations-states` service on path `/locations-states`
const { LocationsStates } = require('./locations-states.class');
const createModel = require('../../models/locations-states.model');
const hooks = require('./locations-states.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/locations-states', new LocationsStates(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('locations-states');

  service.hooks(hooks);
};
