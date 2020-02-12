const assert = require('assert');
const app = require('../../src/app');

describe('\'express-products\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-products');

    assert.ok(service, 'Registered the service');
  });
});
