const { Service } = require('feathers-objection');

exports.Favorites = class Favorites extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
