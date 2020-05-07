const { Service } = require('feathers-objection');

exports.CoffeeOptionsTemplates = class CoffeeOptionsTemplates extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
