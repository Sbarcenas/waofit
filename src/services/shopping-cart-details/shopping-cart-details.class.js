const { Service } = require('feathers-objection');

exports.ShoppingCartDetails = class ShoppingCartDetails extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
