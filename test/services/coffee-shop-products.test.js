const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee shop products\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-shop-products');

    assert.ok(service, 'Registered the service');
  });
});
