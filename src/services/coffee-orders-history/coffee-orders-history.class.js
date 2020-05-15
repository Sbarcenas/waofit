const { Service } = require('feathers-objection');

exports.CoffeeOrdersHistory = class CoffeeOrdersHistory extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
