const { Service } = require('feathers-objection');

exports.ExpressProductsOrdersDetails = class ExpressProductsOrdersDetails extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
