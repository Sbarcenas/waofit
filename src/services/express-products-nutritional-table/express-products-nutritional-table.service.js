// Initializes the `express-products-nutritional-table` service on path `/express-products-nutritional-table`
const { ExpressProductsNutritionalTable } = require('./express-products-nutritional-table.class');
const createModel = require('../../models/express-products-nutritional-table.model');
const hooks = require('./express-products-nutritional-table.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/express-products-nutritional-table', new ExpressProductsNutritionalTable(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('express-products-nutritional-table');

  service.hooks(hooks);
};
