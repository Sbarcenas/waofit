const assert = require('assert');
const app = require('../../src/app');

describe('\'cron-generate-recurring-orders\' service', () => {
  it('registered the service', () => {
    const service = app.service('cron-generate-recurring-orders');

    assert.ok(service, 'Registered the service');
  });
});
