const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee categories\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-categories');

    assert.ok(service, 'Registered the service');
  });
});
