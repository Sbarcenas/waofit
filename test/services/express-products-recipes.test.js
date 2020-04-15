const assert = require('assert');
const app = require('../../src/app');

describe('\'express-products-recipes\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-products-recipes');

    assert.ok(service, 'Registered the service');
  });
});
