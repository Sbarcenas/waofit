const { Service } = require('feathers-objection');

exports.ExpressProductsOrdersHistory = class ExpressProductsOrdersHistory extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
