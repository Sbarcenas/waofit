const { Service } = require('feathers-objection');

exports.Authors = class Authors extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
