// Initializes the `tax-rule` service on path `/tax-rule`
const { TaxRule } = require('./tax-rule.class');
const createModel = require('../../models/tax-rule.model');
const hooks = require('./tax-rule.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tax-rule', new TaxRule(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tax-rule');

  service.hooks(hooks);
};
