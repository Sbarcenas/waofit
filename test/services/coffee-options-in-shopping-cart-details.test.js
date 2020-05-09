const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee options in shopping cart details\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-options-in-shopping-cart-details');

    assert.ok(service, 'Registered the service');
  });
});
