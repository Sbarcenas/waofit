const { Service } = require('feathers-objection');

exports.CoffeeShopProductsAttributes = class CoffeeShopProductsAttributes extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
