const { Service } = require('feathers-objection');

exports.UsersProductBrandFavorites = class UsersProductBrandFavorites extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
