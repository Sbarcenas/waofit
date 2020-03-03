const { Service } = require('feathers-objection');

exports.ShippingDetails = class ShippingDetails extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
