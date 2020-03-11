const assert = require('assert');
const app = require('../../src/app');

describe('\'process-order-payments\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-order-payments');

    assert.ok(service, 'Registered the service');
  });
});
