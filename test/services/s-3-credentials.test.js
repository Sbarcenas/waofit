const assert = require('assert');
const app = require('../../src/app');

describe('\'s3 credentials\' service', () => {
  it('registered the service', () => {
    const service = app.service('s-3-credentials');

    assert.ok(service, 'Registered the service');
  });
});
