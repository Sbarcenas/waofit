const { Service } = require('feathers-objection');

exports.CoffeeOptOrderDet = class CoffeeOptOrderDet extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
