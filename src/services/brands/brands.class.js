const { Service } = require('feathers-objection');

exports.Brands = class Brands extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
