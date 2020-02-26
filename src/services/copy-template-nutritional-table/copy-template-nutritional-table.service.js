// Initializes the `copy-template-nutritional-table` service on path `/copy-template-nutritional-table`
const { CopyTemplateNutritionalTable } = require('./copy-template-nutritional-table.class');
const hooks = require('./copy-template-nutritional-table.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/copy-template-nutritional-table', new CopyTemplateNutritionalTable(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('copy-template-nutritional-table');

  service.hooks(hooks);
};
