const { Service } = require('feathers-objection');

exports.ExpressProductsRecipes = class ExpressProductsRecipes extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
