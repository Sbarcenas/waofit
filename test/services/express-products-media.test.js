const assert = require('assert');
const app = require('../../src/app');

describe('\'express-products-media\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-products-media');

    assert.ok(service, 'Registered the service');
  });
});
