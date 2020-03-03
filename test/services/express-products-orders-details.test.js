const assert = require('assert');
const app = require('../../src/app');

describe('\'express products orders details\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-products-orders-details');

    assert.ok(service, 'Registered the service');
  });
});
