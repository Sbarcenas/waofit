const assert = require('assert');
const app = require('../../src/app');

describe('\'express-hubs\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-hubs');

    assert.ok(service, 'Registered the service');
  });
});
