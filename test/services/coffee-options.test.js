const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee options\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-options');

    assert.ok(service, 'Registered the service');
  });
});
