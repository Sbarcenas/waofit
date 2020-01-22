const assert = require('assert');
const app = require('../../src/app');

describe('\'credentials\' service', () => {
  it('registered the service', () => {
    const service = app.service('credentials');

    assert.ok(service, 'Registered the service');
  });
});
