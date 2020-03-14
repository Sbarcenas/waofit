const assert = require('assert');
const app = require('../../src/app');

describe('\'payment-confirmations\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-confirmations');

    assert.ok(service, 'Registered the service');
  });
});
