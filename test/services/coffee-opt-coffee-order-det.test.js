const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee opt coffee order det\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-opt-coffee-order-det');

    assert.ok(service, 'Registered the service');
  });
});
