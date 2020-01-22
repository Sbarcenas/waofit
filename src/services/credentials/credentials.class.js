const { Service } = require('feathers-objection');

exports.Credentials = class Credentials extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
