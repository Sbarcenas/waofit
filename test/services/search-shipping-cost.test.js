const assert = require('assert');
const app = require('../../src/app');

describe('\'search-shipping-cost\' service', () => {
  it('registered the service', () => {
    const service = app.service('search-shipping-cost');

    assert.ok(service, 'Registered the service');
  });
});
