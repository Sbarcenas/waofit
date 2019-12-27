const assert = require('assert');
const app = require('../../src/app');

describe('\'users-addresses\' service', () => {
  it('registered the service', () => {
    const service = app.service('users-addresses');

    assert.ok(service, 'Registered the service');
  });
});
