const { Service } = require('feathers-objection');

exports.BlogsAndGuides = class BlogsAndGuides extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
