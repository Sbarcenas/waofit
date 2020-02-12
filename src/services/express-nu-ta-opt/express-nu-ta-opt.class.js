const { Service } = require('feathers-objection');

exports.ExpressNuTaOpt = class ExpressNuTaOpt extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
