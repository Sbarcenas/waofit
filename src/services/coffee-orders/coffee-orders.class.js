const { Service } = require('feathers-objection');

exports.CoffeeOrders = class CoffeeOrders extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
