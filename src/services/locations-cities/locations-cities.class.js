const { Service } = require('feathers-objection');

exports.LocationsCities = class LocationsCities extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
