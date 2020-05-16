const { Service } = require('feathers-objection');

exports.CoffeeOrderDetails = class CoffeeOrderDetails extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
