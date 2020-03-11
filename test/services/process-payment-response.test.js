const assert = require('assert');
const app = require('../../src/app');

describe('\'process payment response\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-payment-response');

    assert.ok(service, 'Registered the service');
  });
});
