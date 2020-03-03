const assert = require('assert');
const app = require('../../src/app');

describe('\'shipping details\' service', () => {
  it('registered the service', () => {
    const service = app.service('shipping-details');

    assert.ok(service, 'Registered the service');
  });
});
