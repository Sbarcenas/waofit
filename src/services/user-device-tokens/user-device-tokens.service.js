// Initializes the `user-device-tokens` service on path `/user-device-tokens`
const { UserDeviceTokens } = require("./user-device-tokens.class");
const createModel = require("../../models/user-device-tokens.model");
const hooks = require("./user-device-tokens.hooks");

module.exports = function(app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate")
    /* whitelist: ['$eager', '$joinRelation'],
    allowedEager: '[users]', */
  };

  // Initialize our service with any options it requires
  app.use("/user-device-tokens", new UserDeviceTokens(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("user-device-tokens");

  service.hooks(hooks);
};
