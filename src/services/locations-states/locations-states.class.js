const { Service } = require('feathers-objection');

exports.LocationsStates = class LocationsStates extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
