// Initializes the `product-brand` service on path `/product-brand`
const { ProductBrand } = require('./product-brand.class');
const createModel = require('../../models/product-brand.model');
const hooks = require('./product-brand.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/product-brand', new ProductBrand(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('product-brand');

  service.hooks(hooks);
};
