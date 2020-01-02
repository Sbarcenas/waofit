const assert = require('assert');
const app = require('../../src/app');

describe('\'current-user\' service', () => {
  it('registered the service', () => {
    const service = app.service('current-user');

    assert.ok(service, 'Registered the service');
  });
});
