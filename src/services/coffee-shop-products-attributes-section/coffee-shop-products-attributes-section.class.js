const { Service } = require('feathers-objection');

exports.CoffeeShopProductsAttributesSection = class CoffeeShopProductsAttributesSection extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
