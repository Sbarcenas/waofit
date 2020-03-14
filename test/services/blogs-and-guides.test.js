const assert = require('assert');
const app = require('../../src/app');

describe('\'blogs and guides\' service', () => {
  it('registered the service', () => {
    const service = app.service('blogs-and-guides');

    assert.ok(service, 'Registered the service');
  });
});
