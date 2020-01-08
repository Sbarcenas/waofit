const assert = require('assert');
const app = require('../../src/app');

describe('\'product-brand\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-brand');

    assert.ok(service, 'Registered the service');
  });
});
