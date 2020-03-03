const { Service } = require('feathers-objection');

exports.Shipping = class Shipping extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
