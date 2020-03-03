const assert = require('assert');
const app = require('../../src/app');

describe('\'orders-status\' service', () => {
  it('registered the service', () => {
    const service = app.service('orders-status');

    assert.ok(service, 'Registered the service');
  });
});
