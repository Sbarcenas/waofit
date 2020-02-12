const assert = require('assert');
const app = require('../../src/app');

describe('\'express-products-hubs\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-products-hubs');

    assert.ok(service, 'Registered the service');
  });
});
