const assert = require('assert');
const app = require('../../src/app');

describe('\'express-categories\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-categories');

    assert.ok(service, 'Registered the service');
  });
});
