const { Service } = require('feathers-objection');

exports.Cms = class Cms extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
