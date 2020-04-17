// Initializes the `search-shipping-cost` service on path `/search-shipping-cost`
const { SearchShippingCost } = require('./search-shipping-cost.class');
const hooks = require('./search-shipping-cost.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/search-shipping-cost', new SearchShippingCost(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('search-shipping-cost');

  service.hooks(hooks);
};
