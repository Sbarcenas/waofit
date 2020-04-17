const assert = require('assert');
const app = require('../../src/app');

describe('\'shipping cost\' service', () => {
  it('registered the service', () => {
    const service = app.service('shipping-cost');

    assert.ok(service, 'Registered the service');
  });
});
