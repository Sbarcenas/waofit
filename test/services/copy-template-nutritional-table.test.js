const assert = require('assert');
const app = require('../../src/app');

describe('\'copy-template-nutritional-table\' service', () => {
  it('registered the service', () => {
    const service = app.service('copy-template-nutritional-table');

    assert.ok(service, 'Registered the service');
  });
});
