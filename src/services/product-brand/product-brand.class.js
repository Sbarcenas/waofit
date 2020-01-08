const { Service } = require('feathers-objection');

exports.ProductBrand = class ProductBrand extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
