const assert = require('assert');
const app = require('../../src/app');

describe('\'shipping costs\' service', () => {
  it('registered the service', () => {
    const service = app.service('shipping-costs');

    assert.ok(service, 'Registered the service');
  });
});
