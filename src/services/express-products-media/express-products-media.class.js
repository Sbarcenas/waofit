const { Service } = require('feathers-objection');

exports.ExpressProductsMedia = class ExpressProductsMedia extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
