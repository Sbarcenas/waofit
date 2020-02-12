const { Service } = require('feathers-objection');

exports.ExpressProductsHubs = class ExpressProductsHubs extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
