const { Service } = require('feathers-objection');

exports.CoffeeShopProducts = class CoffeeShopProducts extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
