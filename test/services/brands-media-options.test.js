const assert = require('assert');
const app = require('../../src/app');

describe('\'brands-media-options\' service', () => {
  it('registered the service', () => {
    const service = app.service('brands-media-options');

    assert.ok(service, 'Registered the service');
  });
});
