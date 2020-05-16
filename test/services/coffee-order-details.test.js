const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee order details\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-order-details');

    assert.ok(service, 'Registered the service');
  });
});
