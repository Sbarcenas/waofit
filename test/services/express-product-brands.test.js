const assert = require('assert');
const app = require('../../src/app');

describe('\'express-product-brands\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-product-brands');

    assert.ok(service, 'Registered the service');
  });
});
