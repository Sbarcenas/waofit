const assert = require('assert');
const app = require('../../src/app');

describe('\'cms\' service', () => {
  it('registered the service', () => {
    const service = app.service('cms');

    assert.ok(service, 'Registered the service');
  });
});
