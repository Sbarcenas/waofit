const assert = require('assert');
const app = require('../../src/app');

describe('\'users-credit-cards\' service', () => {
  it('registered the service', () => {
    const service = app.service('users-credit-cards');

    assert.ok(service, 'Registered the service');
  });
});
