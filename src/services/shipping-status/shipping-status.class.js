const { Service } = require('feathers-objection');

exports.ShippingStatus = class ShippingStatus extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
