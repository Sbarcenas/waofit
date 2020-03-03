const assert = require('assert');
const app = require('../../src/app');

describe('\'express products orders history\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-products-orders-history');

    assert.ok(service, 'Registered the service');
  });
});
