const assert = require('assert');
const app = require('../../src/app');

describe('\'express-products-nutritional-table\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-products-nutritional-table');

    assert.ok(service, 'Registered the service');
  });
});
