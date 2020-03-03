const { Service } = require('feathers-objection');

exports.OrdersStatus = class OrdersStatus extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
