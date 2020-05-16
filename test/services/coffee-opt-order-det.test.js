const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee opt order det\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-opt-order-det');

    assert.ok(service, 'Registered the service');
  });
});
