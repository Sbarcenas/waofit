// Initializes the `locations-cities` service on path `/locations-cities`
const { LocationsCities } = require('./locations-cities.class');
const createModel = require('../../models/locations-cities.model');
const hooks = require('./locations-cities.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/locations-cities', new LocationsCities(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('locations-cities');

  service.hooks(hooks);
};
