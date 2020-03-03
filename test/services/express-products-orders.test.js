const assert = require('assert');
const app = require('../../src/app');

describe('\'express-products-orders\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-products-orders');

    assert.ok(service, 'Registered the service');
  });
});
