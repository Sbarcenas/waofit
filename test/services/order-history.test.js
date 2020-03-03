const assert = require('assert');
const app = require('../../src/app');

describe('\'order history\' service', () => {
  it('registered the service', () => {
    const service = app.service('order-history');

    assert.ok(service, 'Registered the service');
  });
});
