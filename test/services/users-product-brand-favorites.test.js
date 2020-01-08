const assert = require('assert');
const app = require('../../src/app');

describe('\'users-product-brand-favorites\' service', () => {
  it('registered the service', () => {
    const service = app.service('users-product-brand-favorites');

    assert.ok(service, 'Registered the service');
  });
});
