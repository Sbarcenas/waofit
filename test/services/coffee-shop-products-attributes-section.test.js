const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee shop products attributes section\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-shop-products-attributes-section');

    assert.ok(service, 'Registered the service');
  });
});
