const { Service } = require('feathers-objection');

exports.ExpressProducts = class ExpressProducts extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
