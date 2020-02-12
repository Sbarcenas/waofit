const assert = require('assert');
const app = require('../../src/app');

describe('\'express-nutritional-table-options\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-nutritional-table-options');

    assert.ok(service, 'Registered the service');
  });
});
