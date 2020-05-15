const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee orders history\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-orders-history');

    assert.ok(service, 'Registered the service');
  });
});
