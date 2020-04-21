const { Service } = require('feathers-objection');

exports.RecurringShoppingCart = class RecurringShoppingCart extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
