const { Service } = require('feathers-objection');

exports.BrandsMediaOptions = class BrandsMediaOptions extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
