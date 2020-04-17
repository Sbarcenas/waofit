const { Service } = require('feathers-objection');

exports.ShippingCosts = class ShippingCosts extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
