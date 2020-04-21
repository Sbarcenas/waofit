const assert = require('assert');
const app = require('../../src/app');

describe('\'recurring shopping cart\' service', () => {
  it('registered the service', () => {
    const service = app.service('recurring-shopping-cart');

    assert.ok(service, 'Registered the service');
  });
});
