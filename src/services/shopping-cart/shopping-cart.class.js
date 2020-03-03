const { Service } = require('feathers-objection');

exports.ShoppingCart = class ShoppingCart extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
