const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee_shop_attributes\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-shop-attributes');

    assert.ok(service, 'Registered the service');
  });
});
