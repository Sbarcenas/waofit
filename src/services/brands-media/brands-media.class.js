const { Service } = require('feathers-objection');

exports.BrandsMedia = class BrandsMedia extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
