const assert = require('assert');
const app = require('../../src/app');

describe('\'express-nu-ta-opt\' service', () => {
  it('registered the service', () => {
    const service = app.service('express-nu-ta-opt');

    assert.ok(service, 'Registered the service');
  });
});
