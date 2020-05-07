const assert = require('assert');
const app = require('../../src/app');

describe('\'coffee options templates\' service', () => {
  it('registered the service', () => {
    const service = app.service('coffee-options-templates');

    assert.ok(service, 'Registered the service');
  });
});
