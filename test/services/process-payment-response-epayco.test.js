const assert = require('assert');
const app = require('../../src/app');

describe('\'process-payment-response-epayco\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-payment-response-epayco');

    assert.ok(service, 'Registered the service');
  });
});
