const { Service } = require('feathers-objection');

exports.TaxRule = class TaxRule extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
