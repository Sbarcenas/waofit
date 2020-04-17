const { Service } = require('feathers-objection');

exports.ShippingCost = class ShippingCost extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
