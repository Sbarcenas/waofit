const { Service } = require('feathers-objection');

exports.Orders = class Orders extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
