const { Service } = require('feathers-objection');

exports.CoffeeShopAttributes = class CoffeeShopAttributes extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
