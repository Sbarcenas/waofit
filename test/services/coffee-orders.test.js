const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee orders\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-orders');

    assert.ok(service, 'Registered the service');
  });
});
