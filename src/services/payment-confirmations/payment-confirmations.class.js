const { Service } = require('feathers-objection');

exports.PaymentConfirmations = class PaymentConfirmations extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
