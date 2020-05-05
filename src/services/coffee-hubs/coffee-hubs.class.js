const { Service } = require('feathers-objection');

exports.CoffeeHubs = class CoffeeHubs extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
