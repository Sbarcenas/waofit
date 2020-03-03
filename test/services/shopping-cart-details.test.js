const assert = require('assert');
const app = require('../../src/app');

describe('\'shopping cart details\' service', () => {
  it('registered the service', () => {
    const service = app.service('shopping-cart-details');

    assert.ok(service, 'Registered the service');
  });
});
