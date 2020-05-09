const { Service } = require('feathers-objection');

exports.CoffeeOptions = class CoffeeOptions extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
