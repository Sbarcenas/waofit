const assert = require('assert');
const app = require('../../src/app');

describe('\'shopping-cart-custom\' service', () => {
  it('registered the service', () => {
    const service = app.service('shopping-cart-custom');

    assert.ok(service, 'Registered the service');
  });
});
