const { Service } = require("feathers-objection");

exports.ExpressCategories = class ExpressCategories extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
