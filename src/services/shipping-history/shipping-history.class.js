const { Service } = require('feathers-objection');

exports.ShippingHistory = class ShippingHistory extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
