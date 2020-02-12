const { Service } = require('feathers-objection');

exports.ExpressProductsNutritionalTable = class ExpressProductsNutritionalTable extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
