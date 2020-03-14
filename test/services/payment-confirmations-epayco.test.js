const assert = require('assert');
const app = require('../../src/app');

describe('\'payment-confirmations-epayco\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-confirmations-epayco');

    assert.ok(service, 'Registered the service');
  });
});
