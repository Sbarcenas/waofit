const assert = require('assert');
const app = require('../../src/app');

describe('\'calculate next delivery\' service', () => {
  it('registered the service', () => {
    const service = app.service('calculate-next-delivery');

    assert.ok(service, 'Registered the service');
  });
});
