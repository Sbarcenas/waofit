const { Service } = require('feathers-objection');

exports.ExpressHubs = class ExpressHubs extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
