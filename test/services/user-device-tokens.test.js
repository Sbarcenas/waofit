const assert = require('assert');
const app = require('../../src/app');

describe('\'user-device-tokens\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-device-tokens');

    assert.ok(service, 'Registered the service');
  });
});
