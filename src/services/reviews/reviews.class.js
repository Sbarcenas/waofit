const { Service } = require('feathers-objection');

exports.Reviews = class Reviews extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
