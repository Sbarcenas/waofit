const assert = require('assert');
const app = require('../../src/app');

describe('\'locations-states\' service', () => {
  it('registered the service', () => {
    const service = app.service('locations-states');

    assert.ok(service, 'Registered the service');
  });
});
