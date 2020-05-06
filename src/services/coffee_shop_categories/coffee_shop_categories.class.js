const { Service } = require('feathers-objection');

exports.CoffeeShopCategories = class CoffeeShopCategories extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
