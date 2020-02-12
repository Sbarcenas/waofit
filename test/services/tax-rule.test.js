const assert = require('assert');
const app = require('../../src/app');

describe('\'tax-rule\' service', () => {
  it('registered the service', () => {
    const service = app.service('tax-rule');

    assert.ok(service, 'Registered the service');
  });
});
