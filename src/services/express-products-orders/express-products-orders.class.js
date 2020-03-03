const { Service } = require('feathers-objection');

exports.ExpressProductsOrders = class ExpressProductsOrders extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
