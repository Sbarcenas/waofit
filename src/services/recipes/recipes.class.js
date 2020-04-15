const { Service } = require('feathers-objection');

exports.Recipes = class Recipes extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
