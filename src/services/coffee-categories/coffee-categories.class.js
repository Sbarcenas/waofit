const { Service } = require('feathers-objection');

exports.CoffeeCategories = class CoffeeCategories extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
