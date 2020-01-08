const { Service } = require('feathers-objection');

exports.UsersCreditCards = class UsersCreditCards extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
