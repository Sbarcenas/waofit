const assert = require('assert');
const app = require('../../src/app');

describe('\'shopping-cart\' service', () => {
  it('registered the service', () => {
    const service = app.service('shopping-cart');

    assert.ok(service, 'Registered the service');
  });
});
