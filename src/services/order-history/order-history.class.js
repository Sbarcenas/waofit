const { Service } = require('feathers-objection');

exports.OrderHistory = class OrderHistory extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
