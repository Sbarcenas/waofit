const assert = require('assert');
const app = require('../../src/app');

describe('\'shipping\' service', () => {
  it('registered the service', () => {
    const service = app.service('shipping');

    assert.ok(service, 'Registered the service');
  });
});
