const assert = require('assert');
const app = require('../../src/app');

describe('\'shipping status\' service', () => {
  it('registered the service', () => {
    const service = app.service('shipping-status');

    assert.ok(service, 'Registered the service');
  });
});
