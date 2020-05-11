const { Service } = require('feathers-objection');

exports.CoffeeShopProductsAttributesOfSection = class CoffeeShopProductsAttributesOfSection extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
