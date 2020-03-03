const assert = require('assert');
const app = require('../../src/app');

describe('\'shipping history\' service', () => {
  it('registered the service', () => {
    const service = app.service('shipping-history');

    assert.ok(service, 'Registered the service');
  });
});
