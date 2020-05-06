const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee_shop_categories\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-shop-categories');

    assert.ok(service, 'Registered the service');
  });
});
