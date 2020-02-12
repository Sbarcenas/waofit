const assert = require('assert');
const app = require('../../src/app');

describe('\'brands-media\' service', () => {
  it('registered the service', () => {
    const service = app.service('brands-media');

    assert.ok(service, 'Registered the service');
  });
});
