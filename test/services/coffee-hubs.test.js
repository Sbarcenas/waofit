const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee hubs\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-hubs');

    assert.ok(service, 'Registered the service');
  });
});
