const { Service } = require('feathers-objection');

exports.UsersAddresses = class UsersAddresses extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
