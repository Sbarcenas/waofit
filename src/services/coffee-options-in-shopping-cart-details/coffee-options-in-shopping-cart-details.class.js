const { Service } = require('feathers-objection');

exports.CoffeeOptionsInShoppingCartDetails = class CoffeeOptionsInShoppingCartDetails extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
